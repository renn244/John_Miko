import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClosureDto } from './dto/create-closure.dto';
import { GetClosureByDateQueryDto } from './query/getClosureByDate.query';

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

    // this get can get per accommodation with accommodation closure and entire resort
    // for entire resort just entire resort closures no specific accommodations
    async getClosures(mode: 'withGlobal' | 'specific', accommodationId?: string) {
        const where: Prisma.ClosureWhereInput = mode === 'withGlobal' ? {
            OR: [
                { accommodationId: accommodationId },
                { accommodationId: null }
            ]
        } : {
            accommodationId: accommodationId ?? null
        }
        
        const closures = await this.prisma.closure.findMany({
            where: where,
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


    async getClosureByDate(query: GetClosureByDateQueryDto) {
        const closure = await this.prisma.closure.findFirst({
            where: {
                accommodationId: query.accommodationId ?? null,
                date: query.date
            }
        })

        if(!closure) {
            throw new NotFoundException("closure not found")
        }

        return closure
    }

    async validateClosureDate(accommodationId: string, date: Date) {
        const existingClosure = await this.prisma.closure.findFirst({
            where: {
                date: date,
                OR: [
                    { accommodationId: accommodationId }, // check for closures for specific accommodation
                    { accommodationId: null } // fall back and also check for global closures on specific accommodation also
                ],
            }, 
            select: { id: true}
        })

        return !!existingClosure;
    }

    async deleteClosure(closureId: string) {
        const deletedClosure = await this.prisma.closure.delete({
            where: {
                id: closureId
            }
        })

        if(!deletedClosure) {
            throw new NotFoundException("closure not found")
        }

        return deletedClosure;
    }
}
