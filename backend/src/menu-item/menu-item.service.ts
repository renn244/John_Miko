import { Injectable, NotFoundException } from '@nestjs/common';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { GetMenuItemsQuery } from './query/getMenuItem.query';

@Injectable()
export class MenuItemService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createMenuItem(body: CreateMenuItemDto) {
    const menuItem = await this.prisma.menuItem.create({
      data: {
        imageUrl: body.imageUrl,
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        availability: body.availability
      }
    })

    return menuItem;
  }

  async getMenuItems(query: GetMenuItemsQuery) {
    const { search, ...rest } = cleanPrismaWhere(query);

    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        ...rest, 
        name: { contains: search, mode: 'insensitive' }
      }
    })

    return menuItems;
  }

  async getMenuItemsBulk(ids: string[]) {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: ids }
      }
    })
    
    return menuItems;
  }

  async getMenuItemCategories() {
    const categories = await this.prisma.menuItem.findMany({ 
      distinct: ['category'], select: { category: true } 
    });

    return categories.map((c) => c.category);
  }

  async getMenuItemStats() {
    const [total, grouped] = await Promise.all([
      this.prisma.menuItem.count(),
      this.prisma.menuItem.groupBy({
        by: ['availability'],
        _count: { availability: true },
      })
    ]);

    const stats: Record<string, number> = {};
    grouped.forEach((item) => stats[item.availability.toLowerCase()] = item._count.availability);

    return { 
      total,
      ...stats,
    }
  }

  async getMenuItemById(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });

    if(!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async updateMenuItem(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const existingMenuItem = await this.getMenuItemById(id);

    if(!existingMenuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const menuItem = await this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto
    })

    return menuItem;
  }

  async deleteMenuItem(id: string) {
    const existingMenuItem = await this.getMenuItemById(id);

    if(!existingMenuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const menuItem = await this.prisma.menuItem.delete({ where: { id } })

    return menuItem;
  }
}
