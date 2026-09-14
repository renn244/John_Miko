import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { BookingStatus } from 'src/generated/prisma/enums';
import { toDateOnly } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';
import { CreateAccommodationDto, UpdateAccommodationDto } from './dto/accommodation.dto';
import { GetAccommodationQueryDto } from './query/get-accommodations-query.dto';

@Injectable()
export class AccommodationService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    async createAccommodation(body: CreateAccommodationDto) {
        const { stayOptions, ...accommodationData } = body;
        
        const accommodation = await this.prisma.accommodation.create({
            data: {
                ...accommodationData,
                stayOptions: {
                    create: stayOptions.map((stayOption) => ({
                        code: stayOption.code,
                        label: stayOption.label,
                        durationHours: stayOption.durationHours,
                        startTime: stayOption.startTime,
                        endTime: stayOption.endTime,
                        sortOrder: stayOption.sortOrder,
                        isActive: stayOption.isActive,
                    }))
                }
            },
            include: {
                stayOptions: {
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        await this.cache.del(CATALOG_CACHE_KEY);
        return accommodation;
    }

    async getAccommodationStats() {
        const [total, grouped] = await Promise.all([
            this.prisma.accommodation.count({ where: { retiredAt: null } }),
            this.prisma.accommodation.groupBy({
                by: ['type'], where: { retiredAt: null },
                _count: { type: true },
            })
        ]);

        const stats: Record<string, number> = {};
        grouped.forEach((item) => stats[item.type.toLowerCase()] = item._count.type);

        return {
            total,
            ...stats,
        };
    }

    async getAccommodationOptions() {
        const optionsAccommodation = await this.prisma.accommodation.findMany({
            where: { retiredAt: null },
            select: { id: true, name: true }
        })
        
        return optionsAccommodation;
    }

    async getAccommodations(query: GetAccommodationQueryDto, retiredOnly = false) {
        const { search, page, limit, date, ...rest } = cleanPrismaWhere(query);

        if (date) {
            const globalClosure = await this.prisma.closure.findFirst({
                where: { accommodationId: null, date },
                select: { id: true },
            });

            if (globalClosure) {
                return {
                    data: [],
                    meta: getPaginationMeta(0, page, limit),
                };
            }
        }

        const where: Prisma.AccommodationWhereInput = {
            ...rest,
            retiredAt: retiredOnly ? { not: null } : null,
            name: { contains: search, mode: 'insensitive' as const },
            ...(date ? {
                closures: { none: { date } },
                stayOptions: {
                    some: {
                        isActive: true,
                        bookings: {
                            none: {
                                bookingDate: date,
                                status: { notIn: [BookingStatus.Cancelled] },
                            },
                        },
                    },
                },
            } : {}),
        };

        const [data, total] = await Promise.all([
            this.prisma.accommodation.findMany({ 
                where,
                include: {
                    stayOptions: {
                        where: {
                            isActive: true,
                            ...(date ? {
                                bookings: {
                                    none: {
                                        bookingDate: date,
                                        status: { notIn: [BookingStatus.Cancelled] },
                                    },
                                },
                            } : {}),
                        },
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                ...getPaginationArgs(page, limit),
                orderBy: { name: 'asc' },
            }),
            this.prisma.accommodation.count({ where })
        ])

        return { 
            data,
            meta: getPaginationMeta(total, page, limit)
        }
    }

    async getAccommodationReports(date?: Date) {
        const reportDate = toDateOnly(date ?? new Date())
        const nextReportDate = new Date(reportDate);
        nextReportDate.setUTCDate(nextReportDate.getUTCDate() + 1);

        const accommodations = await this.prisma.accommodation.findMany({
            where: {
                OR: [
                    { retiredAt: null },
                    { retiredAt: { gte: nextReportDate } },
                ],
            },
            select: {
                type: true,
                bookings: {
                    where: {
                        bookingDate: reportDate,
                        status: {
                            in: ['Confirmed', 'Completed'],
                        },
                    },
                    select: {
                        id: true,
                        numberOfGuests: true,
                        stayOptionLabelSnapshot: true,
                    },
                },
            }
        });

        const reportPerRoom = accommodations.reduce((acc, item) => {
            const type = item.type === 'EventHall'
                ? 'eventHalls'
                : item.type === 'Room'
                ? 'room'
                : 'cottages';

            const isOccupied = item.bookings.length > 0;

            acc[type].total += 1;

            if (isOccupied) {
                acc[type].occupied += 1;
            } else {
                acc[type].free += 1;
            }

            return acc;
        }, {
            cottages: { occupied: 0, free: 0, total: 0 },
            room: { occupied: 0, free: 0, total: 0 },
            eventHalls: { occupied: 0, free: 0, total: 0 },
        });

        const { total, occupied, free } = Object.values(reportPerRoom)
            .reduce((sum, occ) => ({ 
                total: sum.total + occ.total, occupied: sum.occupied + occ.occupied, free: sum.free + occ.free 
            }), { total: 0, occupied: 0, free: 0 })

        return {
            ...reportPerRoom,
            occupancyRate: Math.round((occupied / total) * 100),
            totalCapacity: total,
            totalFree: free
        };
    }

    async getAccommodationById(id: string) {
        const accommodation = await this.prisma.accommodation.findFirst({
            where: { id, retiredAt: null },
            include: {
                stayOptions: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        if (!accommodation) {
            throw new NotFoundException('Accommodation not found');
        }

        return accommodation;
    }

    async updateAccommodation(id: string, body: UpdateAccommodationDto) {
        const accommodation = await this.prisma.accommodation.update({ where: { id }, data: body });
        await this.cache.del(CATALOG_CACHE_KEY);
        return accommodation;
    }

    async retireAccommodation(id: string) {
        const accommodation = await this.prisma.accommodation.findUnique({ where: { id } });
        if (!accommodation) throw new NotFoundException('Accommodation not found');
        if (accommodation.retiredAt) return accommodation;

        const upcomingBookings = await this.prisma.booking.count({
            where: {
                accommodationId: id,
                bookingDate: { gte: toDateOnly(new Date(Date.now())) },
                status: { in: [BookingStatus.Pending, BookingStatus.Confirmed] },
            },
        });
        if (upcomingBookings) {
            throw new BadRequestException('Reschedule or cancel upcoming bookings before retiring this accommodation.');
        }

        const retired = await this.prisma.accommodation.update({
            where: { id },
            data: { retiredAt: new Date() },
        });
        await this.cache.del(CATALOG_CACHE_KEY);
        return retired;
    }

    async restoreAccommodation(id: string) {
        const accommodation = await this.prisma.accommodation.update({
            where: { id },
            data: { retiredAt: null },
        });
        await this.cache.del(CATALOG_CACHE_KEY);
        return accommodation;
    }
}
