import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MenuItem, Prisma } from 'src/generated/prisma/client';
import { PreOrderMenuItemCreateManyInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllPreOrdesQuery } from './query/get-all-preOrders.query';

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
        
        // asserts everything exists before creating any pre-order, to avoid partial creation if some menu item is not found
        this.assertAllMenuItemsExist(menuItemsInfo, menuItemIds);
        
        // calculate total and saved
        const total = this.calculatePreOrderTotal(menuItems, menuItemsInfo);

        const preOrders = await tx.preOrderMenuItem.createMany({ 
            data: this.transformPreOrderData(bookingId, menuItems, menuItemsInfo) 
        })

        return {
            total
        };
    }

    private calculatePreOrderTotal(menuItems: { menuItemId: string, quantity: number }[], menuItemsInfo: MenuItem[]) {
        const menuItemsMap = new Map(menuItemsInfo.map(item => [item.id, item]));    
    
        const total = menuItems.reduce((sum, item) => {
            const menuItemInfo = menuItemsMap.get(item.menuItemId);
            const menuItemPrice = menuItemInfo?.price ?? 0;
            
            return sum + (menuItemPrice * item.quantity);
        }, 0)

        return total;
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

    async getPreOrders(query: GetAllPreOrdesQuery) {
        const bookings = await this.prisma.booking.findMany({
            // where: {
            //     ...(query.search ? {
            //         OR: [
            //             { guestName: { contains: query.search, mode: 'insensitive' } },
            //             { id: { contains: query.search, mode: 'insensitive' } }
            //         ]
            //     } : {}),
            //     bookingDate: query.date
            // },
            select: {
                id: true,
                guestName: true,
                bookingDate: true,
                timeSlot: true,
                status: true,
                bookedAccommodation: {
                    select: {
                        name: true
                    }
                },
                preOrders: true
            }
        })

        return bookings;
    }

    async getPreOrderDetailsByBookingId(bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            select: {
                id: true,
                guestName: true,
                email: true,
                contactNo: true,

                bookingDate: true,
                timeSlot: true,
                numberOfGuests: true,

                specialRequests: true,

                preOrders: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true
                    }
                }
            }
        })

        if(!booking) {
            throw new NotFoundException('Booking not found')
        }

        return booking
    }
}
