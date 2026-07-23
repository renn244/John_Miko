import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { doBookingStayWindowsOverlap } from 'src/lib/utils/booking-stay.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/services.dto';
import { GetServicesQueryDto } from './query/getServices.dto';

@Injectable()
export class ServicesService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    async createService(body: CreateServiceDto) {
        // probably will check for name for uniquness
        const newService = await this.prisma.addOnService.create({
            data: body
        })

        await this.cache.del(CATALOG_CACHE_KEY);
        return newService
    }

    async getServices(query: GetServicesQueryDto) {
        const where: Prisma.AddOnServiceWhereInput = {
            name: { contains: query.search, mode: 'insensitive' },
        }

        const [data, total] = await Promise.all([
            this.prisma.addOnService.findMany({ 
                where, 
                ...getPaginationArgs(query.page, query.limit)
            }),
            this.prisma.addOnService.count({
                where
            })
        ])

        return {
            data,
            meta: getPaginationMeta(total, query.page, query.limit)
        }
    }

    async getServicesAvailableForBooking(query: { bookingDate: Date, stayOptionId: string }) {
        const requestedStayOption = await this.prisma.accommodationStayOption.findFirst({
            where: {
                id: query.stayOptionId,
                isActive: true,
            },
        });

        if (!requestedStayOption) {
            throw new NotFoundException('Stay option not found');
        }

        const services = await this.prisma.addOnService.findMany({
            where: { isActive: true },
        });
        const previousDate = new Date(query.bookingDate);
        previousDate.setUTCDate(previousDate.getUTCDate() - 1);
        const nextDate = new Date(query.bookingDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);

        const bookedServices = await this.prisma.bookingAddOn.findMany({
            where: {
                booking: {
                    bookingDate: {
                        gte: previousDate,
                        lte: nextDate,
                    },
                    status: { notIn: ["Cancelled"] }
                },
            },
            include: {
                booking: {
                    select: {
                        bookingDate: true,
                        stayOptionId: true,
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

        const overlappingBookedServices = bookedServices.filter((bookedService) =>
            doBookingStayWindowsOverlap(
                {
                    bookingDate: query.bookingDate,
                    startTime: requestedStayOption.startTime,
                    endTime: requestedStayOption.endTime,
                },
                {
                    bookingDate: bookedService.booking.bookingDate,
                    startTime: bookedService.booking.stayOption?.startTime,
                    endTime: bookedService.booking.stayOption?.endTime,
                },
            ),
        );

        const serviceIdToBookedQuantityMap = overlappingBookedServices.reduce<Record<string, number>>((acc, bookedService) => {
            const serviceId = bookedService.addOnServiceId;
            const quantity = bookedService.quantity;

            if(!acc[serviceId]) {
                acc[serviceId] = 0;
            }

            acc[serviceId] += quantity;
            return acc;
        }, {})

        const servicesWithAvailability = services.map((service) => {
            const bookedQuantity = serviceIdToBookedQuantityMap[service.id] || 0;
            
            const availableQuantity = service.quantity - bookedQuantity;

            return {
                ...service,
                quantity: availableQuantity ? availableQuantity : 0
            }
        })

        return servicesWithAvailability.filter(service => service.quantity > 0);
    }

    async getServicesStats() {
        const [totalStocks, services] = await Promise.all([
            this.prisma.addOnService.aggregate({ _sum: { quantity: true } }),
            this.prisma.addOnService.findMany({ select: { quantity: true, price: true } })
        ])

        const totalValue = services.reduce(
            (acc, current) => (current.price * current.quantity) + acc, 0
        )

        return {
            totalServices: services.length ?? 0,
            totalStocks: totalStocks._sum.quantity ?? 0,
            totalValue: totalValue ?? 0
        }
    }
    
    async getServiceById(serviceId: string) {
        const service = await this.prisma.addOnService.findFirst({
            where: { id: serviceId }
        });

        if (!service) {
            throw new NotFoundException("Service not found")
        }
        
        return service;
    }

    async updateService(serviceId: string, body: UpdateServiceDto) {
        const service = await this.prisma.addOnService.update({
            where: { id: serviceId },
            data: body
        })

        await this.cache.del(CATALOG_CACHE_KEY);
        return service;
    }

    async updateServiceAvailability(serviceId: string, isActive: boolean) {
        const service = await this.prisma.addOnService.update({
            where: { id: serviceId },
            data: { isActive },
        });

        await this.cache.del(CATALOG_CACHE_KEY);
        return service;
    }

    async deleteService(serviceId: string) {
        // should be jsut soft delete using flags in the database
        const service = await this.prisma.addOnService.delete({
            where: { id: serviceId }
        })

        await this.cache.del(CATALOG_CACHE_KEY);
        return service;
    }
}
