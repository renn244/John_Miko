import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { AccommodationType, BookingStatus } from 'src/generated/prisma/enums';
import { toDateOnly } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CATALOG_CACHE_KEY } from 'src/rag/catalog-search.service';
import { CreateAccommodationDto, UpdateAccommodationDto } from './dto/accommodation.dto';
import { GetAccommodationQueryDto } from './query/get-accommodations-query.dto';

type StayOptionReport = {
    label: string;
    booked: number;
    pending: number;
    available: number;
    totalSlots: number;
};

type AccommodationCategoryReport = {
    booked: number;
    pending: number;
    available: number;
    totalSlots: number;
    stayOptions: Record<string, StayOptionReport>;
};

type AccommodationReportAccumulator = {
    cottages: AccommodationCategoryReport;
    room: AccommodationCategoryReport;
    eventHalls: AccommodationCategoryReport;
    occupancyRate: number;
    totalSlots: number;
    totalAvailable: number;
};

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

        const globalClosure = await this.prisma.closure.findFirst({
            where: { accommodationId: null, date: reportDate },
            select: { id: true },
        });

        if (globalClosure) {
            return this.formatAccommodationReport(this.createEmptyAccommodationReport());
        }

        const accommodations = await this.prisma.accommodation.findMany({
            where: {
                OR: [
                    { retiredAt: null },
                    { retiredAt: { gte: nextReportDate } },
                ],
                closures: { none: { date: reportDate } },
            },
            select: {
                type: true,
                stayOptions: {
                    where: {
                        isActive: true,
                    },
                    orderBy: { sortOrder: 'asc' },
                    select: {
                        label: true,
                        bookings: {
                            where: {
                                bookingDate: reportDate,
                                status: {
                                    in: [
                                        BookingStatus.Pending,
                                        BookingStatus.Confirmed,
                                        BookingStatus.Completed,
                                    ],
                                },
                            },
                            select: { status: true },
                        },
                    },
                },
            }
        });

        const report = this.createEmptyAccommodationReport();

        accommodations.forEach((accommodation) => {
            const category = this.getAccommodationReportCategory(
                report,
                accommodation.type,
            );

            accommodation.stayOptions.forEach((stayOption) => {
                this.recordStayOption(
                    category,
                    stayOption.label,
                    stayOption.bookings[0]?.status,
                );
            });
        });

        const totals = this.calculateAccommodationReportTotals(report);

        return this.formatAccommodationReport({
            ...report,
            ...totals,
        });
    }

    private getAccommodationReportCategory(
        report: AccommodationReportAccumulator,
        type: AccommodationType,
    ) {
        if (type === AccommodationType.EventHall) return report.eventHalls;
        if (type === AccommodationType.Room) return report.room;

        return report.cottages;
    }

    private recordStayOption(
        category: AccommodationCategoryReport,
        label: string,
        status?: BookingStatus,
    ) {
        const option = category.stayOptions[label] ?? {
            label,
            booked: 0,
            pending: 0,
            available: 0,
            totalSlots: 0,
        };

        option.totalSlots += 1;
        category.totalSlots += 1;

        if (status === BookingStatus.Confirmed || status === BookingStatus.Completed) {
            option.booked += 1;
            category.booked += 1;
        } else if (status === BookingStatus.Pending) {
            option.pending += 1;
            category.pending += 1;
        } else {
            option.available += 1;
            category.available += 1;
        }

        category.stayOptions[label] = option;
    }

    private calculateAccommodationReportTotals(report: AccommodationReportAccumulator) {
        const { totalSlots, booked, available } = [
            report.cottages,
            report.room,
            report.eventHalls,
        ].reduce(
            (sum, category) => ({
                totalSlots: sum.totalSlots + category.totalSlots,
                booked: sum.booked + category.booked,
                available: sum.available + category.available,
            }),
            { totalSlots: 0, booked: 0, available: 0 },
        );

        return {
            occupancyRate: totalSlots > 0 ? Math.round((booked / totalSlots) * 100) : 0,
            totalSlots,
            totalAvailable: available,
        };
    }

    private createEmptyAccommodationReport(): AccommodationReportAccumulator {
        const category = () => ({
            booked: 0,
            pending: 0,
            available: 0,
            totalSlots: 0,
            stayOptions: {},
        });

        return {
            cottages: category(),
            room: category(),
            eventHalls: category(),
            occupancyRate: 0,
            totalSlots: 0,
            totalAvailable: 0,
        };
    }

    private formatAccommodationReport(report: AccommodationReportAccumulator) {
        const formatCategory = (category: AccommodationCategoryReport) => ({
            ...category,
            stayOptions: Object.values(category.stayOptions),
        });

        return {
            cottages: formatCategory(report.cottages),
            room: formatCategory(report.room),
            eventHalls: formatCategory(report.eventHalls),
            occupancyRate: report.occupancyRate,
            totalSlots: report.totalSlots,
            totalAvailable: report.totalAvailable,
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
