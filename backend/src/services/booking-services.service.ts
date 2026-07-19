import { BadRequestException, Injectable } from "@nestjs/common";
import { AddOnService, Prisma } from "src/generated/prisma/client";
import { doBookingStayWindowsOverlap } from "src/lib/utils/booking-stay.util";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BookingServicesService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createBulk(
        bookingId: string,
        addOnServices: { addOnServiceId: string, quantity: number }[],
        tx: Prisma.TransactionClient = this.prisma
    ) {
        const addOnServicesId = addOnServices.map(service => service.addOnServiceId);
        const [addOnServicesInfo, booking] = await Promise.all([
            tx.addOnService.findMany({
                where: {
                    id: { in: addOnServicesId },
                    isActive: true,
                }
            }),
            tx.booking.findFirst({
                where: { id: bookingId },
                select: {
                    id: true,
                    bookingDate: true,
                    stayOption: {
                        select: {
                            startTime: true,
                            endTime: true,
                        },
                    },
                },
            }),
        ]);

        if (!booking) {
            throw new BadRequestException('Booking not found for add-on reservation');
        }

        const previousDate = new Date(booking.bookingDate);
        previousDate.setUTCDate(previousDate.getUTCDate() - 1);
        const nextDate = new Date(booking.bookingDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);

        const overlappingBookedAddOns = await tx.bookingAddOn.findMany({
            where: {
                addOnServiceId: { in: addOnServicesId },
                booking: {
                    id: { not: bookingId },
                    bookingDate: {
                        gte: previousDate,
                        lte: nextDate,
                    },
                    status: { notIn: ['Cancelled'] },
                },
            },
            include: {
                booking: {
                    select: {
                        bookingDate: true,
                        stayOption: {
                            select: {
                                startTime: true,
                                endTime: true,
                            },
                        },
                    },
                },
            },
        });
        
        this.assertAllServicesExist(addOnServicesInfo, addOnServicesId);
        this.assertRequestedDoesNotExceedStock(addOnServices, addOnServicesInfo);
        await this.assertAllServicesAvailble(
            addOnServices,
            overlappingBookedAddOns.filter((existingBookingAddOn) =>
                doBookingStayWindowsOverlap(
                    {
                        bookingDate: booking.bookingDate,
                        startTime: booking.stayOption?.startTime,
                        endTime: booking.stayOption?.endTime,
                    },
                    {
                        bookingDate: existingBookingAddOn.booking.bookingDate,
                        startTime: existingBookingAddOn.booking.stayOption?.startTime,
                        endTime: existingBookingAddOn.booking.stayOption?.endTime,
                    },
                ),
            ),
            addOnServicesInfo,
        );
        
        const [total, BookingAddOnService] = await Promise.all([
            this.calculateServicesTotal(addOnServices, addOnServicesInfo),
            tx.bookingAddOn.createMany({
                data: this.transformAddOnServiceData(bookingId, addOnServices, addOnServicesInfo)
            })
        ])
        
        return { total };
    }

    private transformAddOnServiceData(bookingId: string, addOnServices: { addOnServiceId: string, quantity: number }[], addOnServiceInfo: AddOnService[]) {
        const addOnServiceMap = new Map(addOnServiceInfo.map(service => [service.id, service]));

        return addOnServices.map((service) => ({
            bookingId,
            addOnServiceId: service.addOnServiceId,
            quantity: service.quantity,
            name: addOnServiceMap.get(service.addOnServiceId)?.name!,
            price: addOnServiceMap.get(service.addOnServiceId)?.price!
        }));
    }

    private assertAllServicesExist(addOnServicesInfo: AddOnService[], addOnServicesId: string[]) {
        const foundAddOnServiceIds = new Set(addOnServicesInfo.map(service => service.id));
        const missingAddOnServiceIds = addOnServicesId.filter(id => !foundAddOnServiceIds.has(id));
        
        if(missingAddOnServiceIds.length > 0) {
            throw new BadRequestException(`Add on services inactive or not found: ${missingAddOnServiceIds.join(', ')}`);
        }
        
        return;
    }

        
    private assertRequestedDoesNotExceedStock(
        addOnServices: { addOnServiceId: string; quantity: number }[],
        addOnServiceInfo: AddOnService[]
    ) {
        const map = new Map(addOnServiceInfo.map(s => [s.id, s]));
        
        for (const item of addOnServices) {
            const service = map.get(item.addOnServiceId);

            if (!service) continue;

            // later might wanna make this more like returning all the error instead of just throwing on the first one.
            // can be achieved using array to collect all the errors and then throw ValidationError(slightly modified) with the array of errors
            if (item.quantity > service.quantity) {
                throw new BadRequestException(`Requested quantity exceeds available stock for ${service.name}`);
            }
        }

        return;
    }

    private async assertAllServicesAvailble(
        addOnServices: { addOnServiceId: string, quantity: number }[], 
        existingBookingAddOn: { addOnServiceId: string, quantity: number }[],
        addOnServiceInfo: AddOnService[]
    ) {
        const bookedQuantityMap = existingBookingAddOn.reduce<Record<string, number>>((acc, current) => {
            if(!acc[current.addOnServiceId]) {
                acc[current.addOnServiceId] = 0;
            }

            acc[current.addOnServiceId] += current.quantity;
            return acc;
        }, {});

        const serviceMap = new Map(addOnServiceInfo.map(service => [service.id, service]));

        for (const item of addOnServices) {
            const service = serviceMap.get(item.addOnServiceId);

            if (!service) continue;

            const overlappingBookedQuantity = bookedQuantityMap[item.addOnServiceId] || 0;
            const remainingQuantity = Math.max(service.quantity - overlappingBookedQuantity, 0);

            if (item.quantity > remainingQuantity) {
                throw new BadRequestException(`Requested quantity exceeds available stock for ${service.name}`);
            }
        }
    }

    async calculateServicesTotal(addOnServices: { addOnServiceId: string, quantity: number }[], addOnServiceInfo: AddOnService[]) {
        const addOnServiceMap = new Map(addOnServiceInfo.map(service => [service.id, service]));
        
        const total = addOnServices.reduce((sum, service) => {
            const serviceInfo = addOnServiceMap.get(service.addOnServiceId);
            const servicePrice = serviceInfo?.price ?? 0;

            return sum + (servicePrice * service.quantity);
        }, 0)
        
        return total;
    }
    
}
