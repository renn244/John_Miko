import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MenuItem, MenuItemAvailability, PreOrderStatus, Prisma } from 'src/generated/prisma/client';
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
        const menuItemsInfo = await tx.menuItem.findMany({
            where: {
                id: { in: menuItemIds },
                availability: MenuItemAvailability.Available,
            }
        })
        
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
            throw new BadRequestException(`Menu items unavailable or not found: ${missingMenuItemIds.join(', ')}`);
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
        const preOrders = query.status === PreOrderStatus.Completed
            ? {
                some: {},
                every: { status: PreOrderStatus.Completed },
            }
            : query.status === PreOrderStatus.Pending
                ? { some: { status: PreOrderStatus.Pending } }
                : { some: {} };

        const bookings = await this.prisma.booking.findMany({
            where: {
                preOrders,
                ...(query.search ? {
                    OR: [
                        { guestName: { contains: query.search, mode: 'insensitive' } },
                        { id: { contains: query.search, mode: 'insensitive' } },
                        { referenceCode: { contains: query.search, mode: 'insensitive' } },
                    ]
                } : {}),
                ...(query.date ? { bookingDate: query.date } : {})
            },
            select: {
                id: true,
                referenceCode: true,
                guestName: true,
                bookingDate: true,
                stayOptionLabelSnapshot: true,
                preOrders: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        status: true
                    }
                }
            },
            orderBy: { bookingDate: 'desc' }
        })

        return bookings.map((booking) => ({
            bookingId: booking.id,
            referenceCode: booking.referenceCode,
            guestName: booking.guestName,
            bookingDate: booking.bookingDate,
            timeSlot: booking.stayOptionLabelSnapshot,
            preOrders: booking.preOrders
        }));
    }

    async getPreOrderDetailsByBookingId(bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            select: {
                id: true,
                referenceCode: true,
                guestName: true,
                email: true,
                contactNo: true,

                bookingDate: true,
                stayOptionLabelSnapshot: true,
                stayOption: {
                    select: {
                        startTime: true,
                        endTime: true
                    }
                },
                numberOfGuests: true,

                specialRequests: true,

                preOrders: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        status: true
                    }
                }
            }
        })

        if(!booking) {
            throw new NotFoundException('Booking not found')
        }

        return {
            bookingId: booking.id,
            referenceCode: booking.referenceCode,
            guestName: booking.guestName,
            email: booking.email,
            contactNo: booking.contactNo,
            bookingDate: booking.bookingDate,
            timeSlot: booking.stayOptionLabelSnapshot,
            startTime: booking.stayOption?.startTime,
            endTime: booking.stayOption?.endTime,
            numberOfGuests: booking.numberOfGuests,
            specialRequests: booking.specialRequests,
            preOrders: booking.preOrders
        }
    }

    async updatePreOrderStatus(itemId: string, status: PreOrderStatus) {
        this.assertValidPreOrderStatus(status);

        const existingPreOrder = await this.prisma.preOrderMenuItem.findUnique({
            where: { id: itemId }
        });

        if(!existingPreOrder) {
            throw new NotFoundException('Pre-order not found')
        }

        const preOrder = await this.prisma.preOrderMenuItem.update({
            where: { id: itemId },
            data: { status }
        })

        return {
            message: 'Pre-order item status updated successfully',
            preOrder
        };
    }

    async completeAllPreOrdersByBookingId(bookingId: string) {
        const booking = await this.prisma.booking.findFirst({
            where: {
                id: bookingId,
                preOrders: { some: {} }
            },
            select: { id: true }
        });

        if(!booking) {
            throw new NotFoundException('Booking pre-orders not found')
        }

        const result = await this.prisma.preOrderMenuItem.updateMany({
            where: { bookingId },
            data: { status: PreOrderStatus.Completed }
        });

        return {
            message: 'All pre-order items marked as completed',
            updatedCount: result.count
        };
    }

    private assertValidPreOrderStatus(status: PreOrderStatus) {
        if(!Object.values(PreOrderStatus).includes(status)) {
            throw new BadRequestException('Invalid pre-order status. Use Pending or Completed')
        }
    }
}
