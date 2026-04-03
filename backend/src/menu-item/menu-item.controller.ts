import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { MenuItemService } from './menu-item.service';
import { GetMenuItemsQuery } from './query/getMenuItem.query';
import { AuthGuard } from 'src/lib/guards/auth.guard';

@Controller('menu-item')
@UseGuards(AuthGuard)
export class MenuItemController {
  constructor(
    private readonly menuItemService: MenuItemService
  ) {}

  @Post()
  createMenuItem(@Body() body: CreateMenuItemDto) {
    return this.menuItemService.createMenuItem(body);
  }

  @Get()
  getMenuItems(@Query() query: GetMenuItemsQuery) {
    return this.menuItemService.getMenuItems(query);
  }

  @Get('stats')
  getMenuItemStats() {
    return this.menuItemService.getMenuItemStats();
  }

  @Get(':id')
  getMenuItemById(@Param('id') id: string) {
    return this.menuItemService.getMenuItemById(id);
  }

  @Patch(':id')
  updateMenuItem(@Param('id') id: string, @Body() body: UpdateMenuItemDto) {
    return this.menuItemService.updateMenuItem(id, body);
  }

  @Delete(':id')
  deleteMenuItem(@Param('id') id: string) {
    return this.menuItemService.deleteMenuItem(id);
  }
}
