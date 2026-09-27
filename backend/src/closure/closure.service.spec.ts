import { ConflictException } from '@nestjs/common';
import { ClosureService } from './closure.service';

describe('ClosureService', () => {
  const prisma = {
    booking: { findFirst: jest.fn() },
    closure: { create: jest.fn() },
  } as any;
  let service: ClosureService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ClosureService(prisma);
  });

  it('creates a closure when no active booking exists', async () => {
    const body = {
      accommodationId: 'accommodation-1',
      date: new Date('2026-09-30T00:00:00.000Z'),
      type: 'Maintenance',
      reason: 'Pool repair',
    } as any;
    prisma.booking.findFirst.mockResolvedValue(null);
    prisma.closure.create.mockResolvedValue({ id: 'closure-1' });

    await expect(service.createClosure(body)).resolves.toEqual({
      id: 'closure-1',
    });
  });

  it('rejects an accommodation closure when an active booking exists', async () => {
    prisma.booking.findFirst.mockResolvedValue({ id: 'booking-1' });

    await expect(
      service.createClosure({
        accommodationId: 'accommodation-1',
        date: new Date('2026-09-30T00:00:00.000Z'),
        type: 'Maintenance',
        reason: 'Pool repair',
      } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('checks every accommodation before creating a resort-wide closure', async () => {
    prisma.booking.findFirst.mockResolvedValue({ id: 'booking-1' });

    await expect(
      service.createClosure({
        date: new Date('2026-09-30T00:00:00.000Z'),
        type: 'Maintenance',
        reason: 'Resort event',
      } as any),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.booking.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.not.objectContaining({ accommodationId: expect.anything() }),
      }),
    );
  });
});
