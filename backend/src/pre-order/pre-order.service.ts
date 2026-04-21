import { BadRequestException, Injectable } from '@nestjs/common';
import { MenuItem, Prisma } from 'src/generated/prisma/client';
import { PreOrderMenuItemCreateManyInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PreOrderService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createBulkPreOrder(
        bookingId: string, 
        menuItems: { menuItemId: string, quantity: number }[],
        tx: Prisma.TransactionClient = this.prisma // for optional transaction support
    ) {
        const menuItemIds = menuItems.map(item => item.menuItemId);
        const menuItemsInfo = await tx.menuItem.findMany({ where: { id: { in: menuItemIds } } })
        
        this.assertAllMenuItemsExist(menuItemsInfo, menuItemIds);

        const preOrders = await tx.preOrderMenuItem.createMany({
            data: this.transformPreOrderData(bookingId, menuItems, menuItemsInfo)
        })

        return preOrders;
    }

    private assertAllMenuItemsExist(menuItemsInfo: MenuItem[], menuItemIds: string[]) {
        const foundMenuItemIds = new Set(menuItemsInfo.map(item => item.id));
        const missingMenuItemIds = menuItemIds.filter(id => !foundMenuItemIds.has(id));

        if(missingMenuItemIds.length > 0) {
            throw new BadRequestException(`Menu items not found: ${missingMenuItemIds.join(', ')}`);
        }

        return;
    }

    private transformPreOrderData(bookingId: string, menuItems: { menuItemId: string, quantity: number }[], menuItemsInfo: MenuItem[]): PreOrderMenuItemCreateManyInput[]  {
        const menuItemMap = new Map(menuItemsInfo.map(item => [item.id, item]));

        return menuItems.flatMap(item => {
            const menuItemInfo = menuItemMap.get(item.menuItemId);
            if(!menuItemInfo) return [];

            return [{
                bookingId,
                name: menuItemInfo.name,
                description: menuItemInfo.description,
                category: menuItemInfo.category,
                quantity: item.quantity,
                price: menuItemInfo.price
            }]
        })
    }
}
