import { BadRequestException } from '@nestjs/common';
import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';
import { AccommodationService } from './accommodation.service';

describe('AccommodationService', () => {
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
});
