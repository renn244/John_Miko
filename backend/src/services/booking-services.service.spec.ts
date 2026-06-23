import { BadRequestException } from '@nestjs/common';
import { BookingServicesService } from './booking-services.service';

describe('BookingServicesService', () => {
  const karaokeService = {
    id: 'service-1',
    imageUrl: 'https://example.com/karaoke.jpg',
    name: 'Karaoke',
    description: 'Reserve the karaoke setup for your stay.',
    price: 1500,
    quantity: 2,
    createdAt: new Date('2026-06-20T00:00:00.000Z'),
  };

  const prisma = {} as any;

  let service: BookingServicesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookingServicesService(prisma);
  });

  it('rejects add-on quantity when overlapping active bookings already consumed the remaining stock', async () => {
    const tx = {
      addOnService: {
        findMany: jest.fn().mockResolvedValue([karaokeService]),
      },
      bookingAddOn: {
        findMany: jest.fn().mockResolvedValue([
          {
            addOnServiceId: 'service-1',
            quantity: 2,
            booking: {
              bookingDate: new Date('2026-06-25T00:00:00.000Z'),
              stayOption: {
                startTime: new Date('1970-01-01T14:00:00.000Z'),
                endTime: new Date('1970-01-01T12:00:00.000Z'),
              },
            },
          },
        ]),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      booking: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'booking-12',
          bookingDate: new Date('2026-06-25T00:00:00.000Z'),
          stayOptionId: 'stay-12',
          status: 'Pending',
          stayOption: {
            startTime: new Date('1970-01-01T08:00:00.000Z'),
            endTime: new Date('1970-01-01T20:00:00.000Z'),
          },
        }),
      },
    } as any;

    await expect(
      service.createBulk(
        'booking-12',
        [{ addOnServiceId: 'service-1', quantity: 1 }],
        tx,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
