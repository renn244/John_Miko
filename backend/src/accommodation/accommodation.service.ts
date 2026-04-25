import { Injectable, NotFoundException } from '@nestjs/common';
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
