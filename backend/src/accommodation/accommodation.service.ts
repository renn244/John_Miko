import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccommodationDto, GetAccommodationQueryDto, UpdateAccommodationDto } from './dto/accommodation.dto';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';

@Injectable()
export class AccommodationService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createAccommodation(body: CreateAccommodationDto) {
        return this.prisma.accommodation.create({ data: body });
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
