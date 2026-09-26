import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { GetMenuItemsQuery } from './query/getMenuItem.query';
import { normalizeMenuCategory } from './utils/normalizeMenuCategory';

@Injectable()
export class MenuItemService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async createMenuItem(body: CreateMenuItemDto) {
    const menuItem = await this.prisma.menuItem.create({
      data: {
        imageUrl: body.imageUrl,
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        availability: body.availability,
      },
    });

    await this.cache.del(CATALOG_CACHE_KEY);
    return menuItem;
  }

  async getMenuItems(query: GetMenuItemsQuery) {
    const { search, category, page, limit, ...rest } = cleanPrismaWhere(query);
    const where: Prisma.MenuItemWhereInput = {
      ...rest,
      ...(category
        ? { category: { equals: category, mode: 'insensitive' } }
        : {}),
      name: { contains: search, mode: 'insensitive' },
    };

    const [data, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        where,
        ...getPaginationArgs(page, limit),
        orderBy: [
          { availability: 'asc' }, // Available -> Unavailable
          { createdAt: 'desc' }, // Newest first
        ],
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return {
      data,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async getMenuItemsBulk(ids: string[]) {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: ids },
      },
    });

    return menuItems;
  }

  async getMenuItemCategories() {
    const categories = await this.prisma.menuItem.findMany({
      distinct: ['category'],
      select: { category: true },
    });

    const categoryMap = new Map<string, string>();

    categories.forEach(({ category }) => {
      const normalizedCategory = normalizeMenuCategory(category);
      categoryMap.set(
        normalizedCategory.toLocaleLowerCase(),
        normalizedCategory,
      );
    });

    return [...categoryMap.values()].sort((first, second) =>
      first.localeCompare(second),
    );
  }

  async getMenuItemStats() {
    const [total, grouped] = await Promise.all([
      this.prisma.menuItem.count(),
      this.prisma.menuItem.groupBy({
        by: ['availability'],
        _count: { availability: true },
      }),
    ]);

    const stats: Record<string, number> = {};
    grouped.forEach(
      (item) =>
        (stats[item.availability.toLowerCase()] = item._count.availability),
    );

    return {
      total,
      ...stats,
    };
  }

  async getMenuItemById(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async updateMenuItem(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const existingMenuItem = await this.getMenuItemById(id);

    if (!existingMenuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const menuItem = await this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto,
    });

    await this.cache.del(CATALOG_CACHE_KEY);
    return menuItem;
  }

  async deleteMenuItem(id: string) {
    const existingMenuItem = await this.getMenuItemById(id);

    if (!existingMenuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const menuItem = await this.prisma.menuItem.delete({ where: { id } });

    await this.cache.del(CATALOG_CACHE_KEY);
    return menuItem;
  }
}
