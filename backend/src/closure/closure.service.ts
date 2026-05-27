import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClosureDto } from './dto/create-closure.dto';

@Injectable()
export class ClosureService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createClosure(body: CreateClosureDto) {
        const newClosure = await this.prisma.closure.create({
            data: {
                accommodationId: body.accommodationId,
                date: body.date,
                type: body.type,
                reason: body.reason
            }
        })

        return newClosure;
    }

    async getClosures(accommodationId?: string) {
        const closures = await this.prisma.closure.findMany({
            where: { 
                OR: [
                    { accommodationId: accommodationId },
                    { accommodationId: null }
                ]
            },
            select: {
                id: true,
                date: true,
                type: true,
                reason: true
            },
            orderBy: { date: 'asc' }
        })

        return closures;
    }

    async deleteClosure(closureId: string) {
        const deletedClosure = await this.prisma.closure.delete({
            where: {
                id: closureId
            }
        })

        return deletedClosure;
    }
}
