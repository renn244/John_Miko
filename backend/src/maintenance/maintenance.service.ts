import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './dto/maintenance.dto';
import { GetMaintenanceDto } from './query/getMaintenance.dto';

@Injectable()
export class MaintenanceService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createMaintenance(user: UserSession, body: CreateMaintenanceDto) {
        const newMaintenance = await this.prisma.maintenance.create({
            data: {
                title: body.title,
                description: body.description,
                imagesUrl:  body.imagesUrl,
                priority: body.priority,
            }
        })

        return newMaintenance;
    }

    async getMaintenances(query: GetMaintenanceDto) {
        const { search, page, limit, ...rest } = cleanPrismaWhere(query);

        const where: Prisma.MaintenanceWhereInput = {
            ...rest,
            ...(search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { id: { contains: search, mode: 'insensitive' } },
                ]
            } : {})
        };

        const [data, total] = await Promise.all([
            this.prisma.maintenance.findMany({
                where,
                ...getPaginationArgs(page, limit),
                orderBy: [
                    { status: "asc" }, // Pending -> In Progress -> Resolved -> Closed
                    { priority: 'desc' }, // high -> medium -> low
                    { createdAt: 'desc' }, // recent tickets
                ]
            }),
            this.prisma.maintenance.count({ where })
        ])

        return {
            data,
            meta: getPaginationMeta(total, page, limit)
        };
    }

    async getMaintenanceStats() {
        const [total, grouped] = await Promise.all([
            this.prisma.maintenance.count(),
            this.prisma.maintenance.groupBy({
                by: ['status'],
                _count: { status: true }
            })
        ])

        const stats: Record<string, number> = {};
        grouped.forEach((item) => stats[item.status] = item._count.status);

        return { total, ...stats };
    }

    async getMaintenanceById(id: string) {
        const maintenance = await this.prisma.maintenance.findUnique({
            where: { id }
        })

        if(!maintenance) {
            throw new NotFoundException("Maintenance ticket not found");
        }

        return maintenance;
    }
    
    async updateMaintenance(id: string, body: UpdateMaintenanceDto) {
        const maintenance = await this.prisma.maintenance.findUnique({
            where: { id }
        })

        if(!maintenance) {
            throw new NotFoundException("Maintenance ticket not found");
        }

        const updatedMaintenance = await this.prisma.maintenance.update({
            where: { id },
            data: body
        })

        return updatedMaintenance;
    }

    async startMaintenance(id: string) {
        const maintenance = await this.findOrThrow(id)

        if(maintenance.status !== 'Pending') {
            throw new BadRequestException("Only pending maintenance tickets can be started");
        }

        const updatedMaintenance = await this.prisma.maintenance.update({
            where: { id },
            data: {
                status: 'InProgress',
                startedAt: new Date()
            }
        })

        return updatedMaintenance;
    }

    async completeMaintenance(id: string, resolutionNotes: string) {
        const maintenance = await this.findOrThrow(id);

        if(maintenance.status !== 'InProgress') {
            throw new BadRequestException("Only in-progress maintenance tickets can be resolved");
        }

        const updatedMaintenance = await this.prisma.maintenance.update({
            where: { id },
            data: {
                status: 'Completed',
                resolutionNotes,
                resolvedAt: new Date()
            }
        })

        return updatedMaintenance;
    }

    async closeMaintenance(id: string) {
        const maintenance = await this.findOrThrow(id);

        if(maintenance.status !== 'Completed') {
            throw new BadRequestException("Only completed maintenance tickets can be closed");
        }

        const updatedMaintenance = await this.prisma.maintenance.update({
            where: { id },
            data: {
                status: 'Closed',
            }
        })

        return updatedMaintenance;
    }

    private async findOrThrow(id: string) {
       const maintenance = await this.prisma.maintenance.findUnique({ where: { id } });
        if (!maintenance) throw new NotFoundException("Maintenance ticket not found");

        return maintenance;
    }
}
