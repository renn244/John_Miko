import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/services.dto';
import { GetServicesQueryDto } from './query/getServices.dto';

@Injectable()
export class ServicesService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createService(body: CreateServiceDto) {
        // probably will check for name for uniquness
        const newService = await this.prisma.addOnService.create({
            data: body
        })

        return newService
    }

    async getServices(query: GetServicesQueryDto) {
        const where: Prisma.AddOnServiceWhereInput = {
            name: { contains: query.search, mode: 'insensitive' },
        }

        const [data, total] = await Promise.all([
            await this.prisma.addOnService.findMany({ 
                where, 
                ...getPaginationArgs(query.page, query.limit)
            }),
            await this.prisma.addOnService.count({
                where
            })
        ])

        return {
            data,
            meta: getPaginationMeta(total, query.page, query.limit)
        }
    }

    async getServicesStats() {
        const [totalStocks, services] = await Promise.all([
            await this.prisma.addOnService.aggregate({ _sum: { quantity: true } }),
            await this.prisma.addOnService.findMany({ select: { quantity: true, price: true } })
        ])

        const totalValue = services.reduce(
            (acc, current) => (current.price * current.quantity) + acc, 0
        )

        return {
            totalServices: services.length ?? 0,
            totalStocks: totalStocks._sum.quantity ?? 0,
            totalValue: totalValue ?? 0
        }
    }
    
    async getServiceById(serviceId: string) {
        const service = await this.prisma.addOnService.findFirst({
            where: { id: serviceId }
        });

        if (!service) {
            throw new NotFoundException("Service not found")
        }
        
        return service;
    }

    async updateService(serviceId: string, body: UpdateServiceDto) {
        const service = await this.prisma.addOnService.update({
            where: { id: serviceId },
            data: body
        })

        return service;
    }

    async deleteService(serviceId: string) {
        // should be jsut soft delete using flags in the database
        const service = await this.prisma.addOnService.delete({
            where: { id: serviceId }
        })

        return service;
    }
}
