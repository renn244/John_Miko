import { CatalogSearchService } from './catalog-search.service';

describe('CatalogSearchService', () => {
  const cache = {
    get: jest.fn().mockResolvedValue(undefined),
    set: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cache.get.mockResolvedValue(undefined);
  });

  it('returns only allowlisted public fields', async () => {
    const prisma = {
      accommodation: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'room-1',
            name: 'Family Room',
            description: 'For families',
            type: 'Room',
            capacity: 6,
            price: 5000,
            isGuestFeeWaived: false,
            amenities: ['Pool'],
            stayOptions: [],
          },
        ]),
      },
      menuItem: { findMany: jest.fn().mockResolvedValue([]) },
      addOnService: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const source = new CatalogSearchService(prisma as never, cache as never);

    const result = await source.search('family room', 5);
    const serialized = JSON.stringify(result);

    expect(result).toHaveLength(1);
    expect(serialized).not.toMatch(
      /imageUrl|bookings|quantity|closures|account|payment/i,
    );
    expect(prisma.accommodation.findMany.mock.calls[0][0].select).toEqual(
      expect.objectContaining({
        id: true,
        name: true,
        price: true,
        stayOptions: expect.any(Object),
      }),
    );
  });

  it('does not match catalog records through common question words', async () => {
    const prisma = {
      accommodation: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'room-1',
            name: 'Dormitory',
            description: 'Shared beds',
            type: 'Room',
            capacity: 10,
            price: 5000,
            isGuestFeeWaived: false,
            amenities: [],
            stayOptions: [],
          },
        ]),
      },
      menuItem: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'menu-1', name: 'Lechon Kawali', description: 'Meal', category: 'Meal', price: 200, availability: true },
        ]),
      },
      addOnService: { findMany: jest.fn().mockResolvedValue([]) },
    };

    const result = await new CatalogSearchService(
      prisma as never,
      cache as never,
    ).search(
      'Tell me about Dormitory',
      5,
    );

    expect(result.map((item) => item.title)).toEqual(['Dormitory']);
  });

  it('returns every accommodation and no other catalog type for an availability list question', async () => {
    const accommodations = ['Dormitory', 'Couple Room #1', 'Cottage #1'].map(
      (name, index) => ({
        id: `room-${index}`,
        name,
        description: 'A public place to stay',
        type: 'Room',
        capacity: 4,
        price: 5000,
        isGuestFeeWaived: false,
        amenities: [],
        stayOptions: [],
      }),
    );
    const prisma = {
      accommodation: { findMany: jest.fn().mockResolvedValue(accommodations) },
      menuItem: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'menu-1',
            name: 'Sizzling Pork Sisig',
            description: 'Meal',
            category: 'Meal',
            price: 200,
            availability: true,
          },
        ]),
      },
      addOnService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'addon-1',
            name: 'Karaoke Machine',
            description: 'Entertainment',
            price: 500,
            isActive: true,
          },
        ]),
      },
    };

    const result = await new CatalogSearchService(
      prisma as never,
      cache as never,
    ).search(
      'What are the available accommodations?',
      10,
    );

    expect(result.map((item) => item.title)).toEqual([
      'Dormitory',
      'Couple Room #1',
      'Cottage #1',
    ]);
    expect(new Set(result.map((item) => item.type))).toEqual(
      new Set(['accommodation']),
    );
  });

  it('does not turn a context-free follow-up into unrelated catalog evidence', async () => {
    const prisma = {
      accommodation: { findMany: jest.fn().mockResolvedValue([]) },
      menuItem: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'menu-1',
            name: 'Onion Rings',
            description: 'Side dish',
            category: 'Food',
            price: 100,
            availability: true,
          },
        ]),
      },
      addOnService: { findMany: jest.fn().mockResolvedValue([]) },
    };

    await expect(
      new CatalogSearchService(prisma as never, cache as never).search(
        "That's it?",
        10,
      ),
    ).resolves.toEqual([]);
  });

  it('reuses the cached public catalog candidates', async () => {
    const accommodation = {
      id: 'room-1',
      name: 'Dormitory',
      description: 'Shared beds',
      type: 'Room',
      capacity: 10,
      price: 5000,
      isGuestFeeWaived: false,
      amenities: [],
      stayOptions: [],
    };
    const prisma = {
      accommodation: { findMany: jest.fn().mockResolvedValue([accommodation]) },
      menuItem: { findMany: jest.fn().mockResolvedValue([]) },
      addOnService: { findMany: jest.fn().mockResolvedValue([]) },
    };
    cache.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce([
        {
          id: accommodation.id,
          type: 'accommodation',
          title: accommodation.name,
          text: JSON.stringify(accommodation),
          searchValues: [accommodation.name, accommodation.description, accommodation.type, ''],
        },
      ]);
    const service = new CatalogSearchService(prisma as never, cache as never);

    await service.search('Dormitory');
    await service.search('Dormitory');

    expect(prisma.accommodation.findMany).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(1);
  });
});
