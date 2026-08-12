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
