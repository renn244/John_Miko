import { BadRequestException } from '@nestjs/common';
import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';
import { AccommodationService } from './accommodation.service';

describe('AccommodationService', () => {
  const cache = { del: jest.fn().mockResolvedValue(undefined) };

  it('invalidates the public catalog after accommodation mutations', async () => {
    const prisma = {
      accommodation: {
        create: jest.fn().mockResolvedValue({ id: 'room-1' }),
        update: jest.fn().mockResolvedValue({ id: 'room-1' }),
        findUnique: jest.fn().mockResolvedValue({ id: 'room-1', retiredAt: null }),
      },
      booking: { count: jest.fn().mockResolvedValue(0) },
    };
    const cache = { del: jest.fn().mockResolvedValue(undefined) };
    const service = new AccommodationService(
      prisma as never,
      cache as never,
    );

    await service.createAccommodation({ stayOptions: [] } as never);
    await service.updateAccommodation('room-1', {});
    await service.retireAccommodation('room-1');
    await service.restoreAccommodation('room-1');

    expect(cache.del).toHaveBeenCalledTimes(4);
    expect(cache.del).toHaveBeenCalledWith(CATALOG_CACHE_KEY);
  });

  it('blocks retirement when a pending or confirmed booking remains', async () => {
    const prisma = {
      accommodation: { findUnique: jest.fn().mockResolvedValue({ id: 'room-1', retiredAt: null }) },
      booking: { count: jest.fn().mockResolvedValue(1) },
    };
    const service = new AccommodationService(prisma as never, { del: jest.fn() } as never);

    await expect(service.retireAccommodation('room-1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reports booked, pending, and available stay options by accommodation category', async () => {
    const reportDate = new Date('2026-09-14T00:00:00.000Z');
    const prisma = {
      closure: { findFirst: jest.fn().mockResolvedValue(null) },
      accommodation: {
        findMany: jest.fn().mockResolvedValue([
          {
            type: 'Room',
            stayOptions: [
              { label: 'Day Stay', bookings: [{ status: 'Confirmed' }] },
              { label: 'Overnight', bookings: [{ status: 'Completed' }] },
              { label: '22 Hours', bookings: [] },
              { label: '12 Hours', bookings: [{ status: 'Pending' }] },
            ],
          },
          {
            type: 'Cottage',
            stayOptions: [
              { label: 'Day Stay', bookings: [] },
              { label: 'Overnight', bookings: [] },
            ],
          },
        ]),
      },
    };
    const service = new AccommodationService(prisma as never, cache as never);

    await expect(service.getAccommodationReports(reportDate)).resolves.toEqual({
      room: {
        booked: 2,
        pending: 1,
        available: 1,
        totalSlots: 4,
        stayOptions: [
          { label: 'Day Stay', booked: 1, pending: 0, available: 0, totalSlots: 1 },
          { label: 'Overnight', booked: 1, pending: 0, available: 0, totalSlots: 1 },
          { label: '22 Hours', booked: 0, pending: 0, available: 1, totalSlots: 1 },
          { label: '12 Hours', booked: 0, pending: 1, available: 0, totalSlots: 1 },
        ],
      },
      cottages: {
        booked: 0,
        pending: 0,
        available: 2,
        totalSlots: 2,
        stayOptions: [
          { label: 'Day Stay', booked: 0, pending: 0, available: 1, totalSlots: 1 },
          { label: 'Overnight', booked: 0, pending: 0, available: 1, totalSlots: 1 },
        ],
      },
      eventHalls: { booked: 0, pending: 0, available: 0, totalSlots: 0, stayOptions: [] },
      occupancyRate: 33,
      totalSlots: 6,
      totalAvailable: 3,
    });

    expect(prisma.accommodation.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ closures: { none: { date: reportDate } } }),
      select: expect.objectContaining({
        stayOptions: expect.objectContaining({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: expect.objectContaining({
            bookings: expect.objectContaining({
              where: {
                bookingDate: reportDate,
                status: { in: ['Pending', 'Confirmed', 'Completed'] },
              },
            }),
          }),
        }),
      }),
    }));
  });

  it('returns no sellable slots when the entire resort is closed', async () => {
    const prisma = {
      closure: { findFirst: jest.fn().mockResolvedValue({ id: 'global-closure' }) },
      accommodation: { findMany: jest.fn() },
    };
    const service = new AccommodationService(prisma as never, cache as never);

    await expect(service.getAccommodationReports(new Date('2026-09-14T00:00:00.000Z'))).resolves.toEqual({
      room: { booked: 0, pending: 0, available: 0, totalSlots: 0, stayOptions: [] },
      cottages: { booked: 0, pending: 0, available: 0, totalSlots: 0, stayOptions: [] },
      eventHalls: { booked: 0, pending: 0, available: 0, totalSlots: 0, stayOptions: [] },
      occupancyRate: 0,
      totalSlots: 0,
      totalAvailable: 0,
    });
    expect(prisma.accommodation.findMany).not.toHaveBeenCalled();
  });
});
