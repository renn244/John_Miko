import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';
import { MenuItemService } from './menu-item.service';

describe('MenuItemService', () => {
  it('invalidates the public catalog after menu-item mutations', async () => {
    const menuItem = { id: 'menu-1' };
    const prisma = {
      menuItem: {
        create: jest.fn().mockResolvedValue(menuItem),
        findUnique: jest.fn().mockResolvedValue(menuItem),
        update: jest.fn().mockResolvedValue(menuItem),
        delete: jest.fn().mockResolvedValue(menuItem),
      },
    };
    const cache = { del: jest.fn().mockResolvedValue(undefined) };
    const service = new MenuItemService(prisma as never, cache as never);

    await service.createMenuItem({} as never);
    await service.updateMenuItem('menu-1', {});
    await service.deleteMenuItem('menu-1');

    expect(cache.del).toHaveBeenCalledTimes(3);
    expect(cache.del).toHaveBeenCalledWith(CATALOG_CACHE_KEY);
  });

  it('returns normalized, unique, alphabetically sorted categories', async () => {
    const prisma = {
      menuItem: {
        findMany: jest
          .fn()
          .mockResolvedValue([
            { category: 'BREAKFAST' },
            { category: 'main dishes' },
            { category: 'Breakfast' },
            { category: '  beverages  ' },
          ]),
      },
    };
    const cache = { del: jest.fn() };
    const service = new MenuItemService(prisma as never, cache as never);

    await expect(service.getMenuItemCategories()).resolves.toEqual([
      'Beverages',
      'Breakfast',
      'Main Dishes',
    ]);
  });

  it('filters a category case-insensitively so legacy values remain visible', async () => {
    const prisma = {
      menuItem: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    };
    const cache = { del: jest.fn() };
    const service = new MenuItemService(prisma as never, cache as never);

    await service.getMenuItems({ category: 'Breakfast', page: 1, limit: 10 });

    expect(prisma.menuItem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { equals: 'Breakfast', mode: 'insensitive' },
        }),
      }),
    );
    expect(prisma.menuItem.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { equals: 'Breakfast', mode: 'insensitive' },
        }),
      }),
    );
  });
});
