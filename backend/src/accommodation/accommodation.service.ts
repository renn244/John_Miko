import { Injectable, NotFoundException } from '@nestjs/common';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccommodationDto, GetAccommodationQueryDto, UpdateAccommodationDto } from './dto/accommodation.dto';

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
        grouped.forEach((item) => stats[item.availability] = item._count.availability);

        return {
            total,
            ...stats,
        };
    }

    async getAccommodations(query: GetAccommodationQueryDto) {
        const { search, ...rest } = cleanPrismaWhere(query);

        return this.prisma.accommodation.findMany({ where: {
            ...rest, name: { contains: search, mode: 'insensitive' }
        } });
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
