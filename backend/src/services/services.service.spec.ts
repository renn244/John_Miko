import { ServicesService } from './services.service';
import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';

describe('ServicesService', () => {
  const karaokeService = {
    id: 'service-1',
    imageUrl: 'https://example.com/karaoke.jpg',
    name: 'Karaoke',
    description: 'Reserve the karaoke setup for your stay.',
    price: 1500,
    quantity: 2,
    isActive: true,
    createdAt: new Date('2026-06-20T00:00:00.000Z'),
  };

  const stayOptions = {
    stay22: {
      id: 'stay-22',
      startTime: new Date('1970-01-01T14:00:00.000Z'),
      endTime: new Date('1970-01-01T12:00:00.000Z'),
    },
    stay12: {
      id: 'stay-12',
      startTime: new Date('1970-01-01T08:00:00.000Z'),
      endTime: new Date('1970-01-01T20:00:00.000Z'),
    },
  };

  const overlappingBookedAddOn = {
    addOnServiceId: 'service-1',
    quantity: 1,
    booking: {
      bookingDate: new Date('2026-06-25T00:00:00.000Z'),
      stayOptionId: 'stay-22',
      status: 'Confirmed',
      stayOption: {
        startTime: new Date('1970-01-01T14:00:00.000Z'),
        endTime: new Date('1970-01-01T12:00:00.000Z'),
      },
    },
  };

  const prisma = {
    addOnService: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    bookingAddOn: { findMany: jest.fn() },
    accommodationStayOption: { findFirst: jest.fn() },
  } as any;

  let service: ServicesService;
  const cache = { del: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ServicesService(prisma, cache as never);

    prisma.accommodationStayOption.findFirst.mockImplementation(
      async ({ where: { id } }: { where: { id: string } }) => {
        if (id === 'stay-22') return stayOptions.stay22;
        if (id === 'stay-12') return stayOptions.stay12;
        return null;
      },
    );
    prisma.addOnService.findMany.mockImplementation(
      async ({ where }: { where?: { isActive?: boolean } } = {}) => {
        const services = [karaokeService];

        if (where?.isActive === true) {
          return services.filter((current) => current.isActive);
        }

        return services;
      },
    );
    prisma.bookingAddOn.findMany.mockImplementation(
      async ({ where }: { where: { booking?: { bookingDate?: { gte: Date; lte: Date } } } }) => {
        const gte = where.booking?.bookingDate?.gte?.toISOString();
        const lte = where.booking?.bookingDate?.lte?.toISOString();

        if (
          gte === '2026-06-24T00:00:00.000Z' &&
          lte === '2026-06-26T00:00:00.000Z'
        ) {
          return [overlappingBookedAddOn];
        }

        return [];
      },
    );
  });

  it('subtracts overlapping bookings even when they use a different stay option', async () => {
    const result = await service.getServicesAvailableForBooking({
      bookingDate: new Date('2026-06-25T00:00:00.000Z'),
      stayOptionId: 'stay-12',
    });

    expect(result).toEqual([
      expect.objectContaining({
        id: 'service-1',
        quantity: 1,
      }),
    ]);
  });

  it('hides inactive add-on services from guest booking availability', async () => {
    prisma.addOnService.findMany.mockImplementation(
      async ({ where }: { where?: { isActive?: boolean } } = {}) => {
        const services = [
          karaokeService,
          {
            ...karaokeService,
            id: 'service-2',
            name: 'BBQ Grill',
            isActive: false,
          },
        ];

        if (where?.isActive === true) {
          return services.filter((current) => current.isActive);
        }

        return services;
      },
    );

    const result = await service.getServicesAvailableForBooking({
      bookingDate: new Date('2026-06-25T00:00:00.000Z'),
      stayOptionId: 'stay-12',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('service-1');
  });

  it('invalidates the public catalog after add-on mutations', async () => {
    prisma.addOnService.create.mockResolvedValue(karaokeService);
    prisma.addOnService.update.mockResolvedValue(karaokeService);
    prisma.addOnService.delete.mockResolvedValue(karaokeService);

    await service.createService({} as never);
    await service.updateService('service-1', {} as never);
    await service.updateServiceAvailability('service-1', false);
    await service.deleteService('service-1');

    expect(cache.del).toHaveBeenCalledTimes(4);
    expect(cache.del).toHaveBeenCalledWith(CATALOG_CACHE_KEY);
  });
});
