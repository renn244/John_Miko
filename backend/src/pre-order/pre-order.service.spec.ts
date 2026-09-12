import { PreOrderService } from './pre-order.service';
import { PreOrderStatus } from 'src/generated/prisma/client';

describe('PreOrderService', () => {
  let service: PreOrderService;
  const prisma = {
    booking: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.booking.findMany.mockResolvedValue([]);
    service = new PreOrderService(prisma as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => jest.useRealTimers());

  it.each([
    ['2026-09-11T15:59:59.999Z', '2026-09-11'],
    ['2026-09-11T16:00:00.000Z', '2026-09-12'],
    ['2026-12-31T16:00:00.000Z', '2027-01-01'],
  ])('uses the resort calendar for active orders at %s', async (now, day) => {
    jest.useFakeTimers().setSystemTime(new Date(now));
    await service.getPreOrders({ scope: 'active' });
    expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ bookingDate: { gte: new Date(day) } }),
      orderBy: { bookingDate: 'asc' },
    }));
  });

  it('keeps past completed orders accessible in history', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-11T16:00:00Z'));
    await service.getPreOrders({ scope: 'history', status: PreOrderStatus.Completed });
    expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        bookingDate: { lt: new Date('2026-09-12') },
        preOrders: { some: {}, every: { status: PreOrderStatus.Completed } },
      }),
      orderBy: { bookingDate: 'desc' },
    }));
  });

  it('intersects a selected past date with the active boundary instead of bypassing it', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-11T16:00:00Z'));
    await service.getPreOrders({ scope: 'active', date: '2026-09-10', search: 'QA' });
    expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        bookingDate: { gte: new Date('2026-09-12'), equals: '2026-09-10' },
        OR: expect.any(Array),
      }),
    }));
  });

  it('preserves the unscoped date filter for existing web callers', async () => {
    await service.getPreOrders({ date: '2026-09-10' });
    expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ bookingDate: { equals: '2026-09-10' } }),
      orderBy: { bookingDate: 'desc' },
    }));
  });

  it('filters bookings by the derived completed kitchen status in the database', async () => {
    await service.getPreOrders({ status: PreOrderStatus.Completed });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          preOrders: {
            some: {},
            every: { status: PreOrderStatus.Completed },
          },
        }),
      }),
    );
  });

  it('filters pending bookings by an outstanding pre-order item in the database', async () => {
    await service.getPreOrders({ status: PreOrderStatus.Pending });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          preOrders: { some: { status: PreOrderStatus.Pending } },
        }),
      }),
    );
  });
});
