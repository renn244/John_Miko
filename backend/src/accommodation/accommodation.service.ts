import { Injectable, NotFoundException } from '@nestjs/common';
import { toDateOnly } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccommodationDto, UpdateAccommodationDto } from './dto/accommodation.dto';
import { GetAccommodationQueryDto } from './query/get-accommodations-query.dto';

@Injectable()
export class AccommodationService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createAccommodation(body: CreateAccommodationDto) {
        const { stayOptions, ...accommodationData } = body;
        
        return this.prisma.accommodation.create({
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
    }

    async getAccommodationStats() {
        const [total, grouped] = await Promise.all([
            this.prisma.accommodation.count(),
            this.prisma.accommodation.groupBy({
                by: ['type'],
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
            select: { id: true, name: true }
        })
        
        return optionsAccommodation;
    }

    async getAccommodations(query: GetAccommodationQueryDto) {
        const { search, page, limit, ...rest } = cleanPrismaWhere(query);

        const [data, total] = await Promise.all([
            this.prisma.accommodation.findMany({ 
                where: {
                    ...rest, name: { contains: search, mode: 'insensitive' },
                },
                include: {
                    stayOptions: {
                        where: { isActive: true },
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                ...getPaginationArgs(page, limit),
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.accommodation.count({ where: { ...rest, name: { contains: search, mode: 'insensitive' } } })
        ])

        return { 
            data,
            meta: getPaginationMeta(total, page, limit)
        }
    }

    async getAccommodationReports() {
        const today = toDateOnly(new Date())

        const accommodations = await this.prisma.accommodation.findMany({
            select: {
                type: true,
                bookings: {
                    where: {
                        bookingDate: today,
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
        const accommodation = await this.prisma.accommodation.findUnique({
            where: { id },
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
        return this.prisma.accommodation.update({ where: { id }, data: body });
    }

    async deleteAccommodation(id: string) {
        return this.prisma.accommodation.delete({ where: { id } });
    }
}
