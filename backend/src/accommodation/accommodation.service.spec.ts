import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';
import { AccommodationService } from './accommodation.service';

describe('AccommodationService', () => {
  it('invalidates the public catalog after accommodation mutations', async () => {
    const prisma = {
      accommodation: {
        create: jest.fn().mockResolvedValue({ id: 'room-1' }),
        update: jest.fn().mockResolvedValue({ id: 'room-1' }),
        delete: jest.fn().mockResolvedValue({ id: 'room-1' }),
      },
    };
    const cache = { del: jest.fn().mockResolvedValue(undefined) };
    const service = new AccommodationService(
      prisma as never,
      cache as never,
    );

    await service.createAccommodation({ stayOptions: [] } as never);
    await service.updateAccommodation('room-1', {});
    await service.deleteAccommodation('room-1');

    expect(cache.del).toHaveBeenCalledTimes(3);
    expect(cache.del).toHaveBeenCalledWith(CATALOG_CACHE_KEY);
  });
});
