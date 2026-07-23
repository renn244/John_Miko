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
});
