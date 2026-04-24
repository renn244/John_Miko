import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { MenuItemService } from './menu-item.service';
import { GetMenuItemsQuery } from './query/getMenuItem.query';

@Controller('menu-item')
@UseGuards(AuthGuard)
export class MenuItemController {
  constructor(
    private readonly menuItemService: MenuItemService
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  async createMenuItem(@Body() body: CreateMenuItemDto) {
    return this.menuItemService.createMenuItem(body);
  }

  @Get()
  async getMenuItems(@Query() query: GetMenuItemsQuery) {
    return this.menuItemService.getMenuItems(query);
  }

  @Get('bulk')
  async getMenuItemsBulk(@Query('ids') ids: string) {
    return this.menuItemService.getMenuItemsBulk(ids.split(','));
  }

  @Get('categories')
  async getMenuItemCategories() {
    return this.menuItemService.getMenuItemCategories();
  }

  @Roles(Role.ADMIN)
  @Get('stats')
  async getMenuItemStats() {
    return this.menuItemService.getMenuItemStats();
  }

  @Get(':id')
  async getMenuItemById(@Param('id') id: string) {
    return this.menuItemService.getMenuItemById(id);
  }

  @Roles(Role.ADMIN)  
  @Patch(':id')
  async updateMenuItem(@Param('id') id: string, @Body() body: UpdateMenuItemDto) {
    return this.menuItemService.updateMenuItem(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteMenuItem(@Param('id') id: string) {
    return this.menuItemService.deleteMenuItem(id);
  }
}
