import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingTimeSlot } from 'src/generated/prisma/enums';
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
        return this.prisma.accommodation.create({ data: body });
    }

    async getAccommodationStats() {
        const [total, grouped] = await Promise.all([
            this.prisma.accommodation.count(),
            this.prisma.accommodation.groupBy({
                by: ['availability'],
                _count: { availability: true },
            })
        ]);

        const stats: Record<string, number> = {};
        grouped.forEach((item) => stats[item.availability.toLowerCase()] = item._count.availability);

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
            await this.prisma.accommodation.findMany({ 
                where: {
                    ...rest, name: { contains: search, mode: 'insensitive' },
                },
                ...getPaginationArgs(page, limit),
                orderBy: { createdAt: 'desc' },
            }),
            await this.prisma.accommodation.count({ where: { ...rest, name: { contains: search, mode: 'insensitive' } } })
        ])

        return { 
            data,
            meta: getPaginationMeta(total, page, limit)
        }
    }

    async getAccommodationReports() {
        const today = toDateOnly(new Date())
        const timeSlot: BookingTimeSlot = 'DayStay'

        const accommodations = await this.prisma.accommodation.findMany({
            where: { availability: 'Available' },
            select: {
                type: true,
                bookings: {
                    where: {
                        bookingDate: today,
                        timeSlot: timeSlot,
                        status: {
                            in: ['Confirmed', 'Completed'],
                        },
                    },
                    select: {
                        id: true,
                        numberOfGuests: true,
                        timeSlot: true
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
        const accommodation = await this.prisma.accommodation.findUnique({ where: { id } });

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
