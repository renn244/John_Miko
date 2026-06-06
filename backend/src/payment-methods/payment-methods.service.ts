import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './dto/payment-methods.dto';
import { GetPaymentMethodsQuery } from './query/get-payment-methods.query';

@Injectable()
export class PaymentMethodsService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createPaymentMethod(body: CreatePaymentMethodDto) {
        const paymentMethod = await this.prisma.paymentMethod.create({
            data: {
                name: body.name,
                type: body.type,
                accountName: body.accountName,
                accountNumber: body.accountNumber,
                instructions: body.instructions,
                qrCodeUrl: body.qrCodeUrl,
                isActive: body.isActive ?? true,
                sortOrder: body.sortOrder ?? 0,
            }
        })

        return paymentMethod;
    }

    async getPaymentMethods(query: GetPaymentMethodsQuery) {
        const { search, page, limit, ...rest } = cleanPrismaWhere(query);

        const where: Prisma.PaymentMethodWhereInput = {
            ...rest,
            ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
        }

        const [data, total] = await Promise.all([
            this.prisma.paymentMethod.findMany({
                where,
                ...getPaginationArgs(page, limit),
                orderBy: [
                    { sortOrder: 'asc' },
                    { createdAt: 'desc' }
                ]
            }),
            this.prisma.paymentMethod.count({ where })
        ])

        return {
            data,
            meta: getPaginationMeta(total, page, limit)
        };
    }

    async getActivePaymentMethods() {
        const methods = await this.prisma.paymentMethod.findMany({
            where: { isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' }
            ]
        })

        return methods;
    }

    async getPaymentMethodById(id: string) {
        const method = await this.prisma.paymentMethod.findUnique({ where: { id } })

        if(!method) {
            throw new NotFoundException('Payment method not found');
        }

        return method;
    }

    async updatePaymentMethodAvailability(id: string, isActive: boolean) {
        await this.getPaymentMethodById(id);

        const method = await this.prisma.paymentMethod.update({
            where: { id },
            data: { isActive }
        })

        return method;
    }

    async updatePaymentMethod(id: string, body: UpdatePaymentMethodDto) {
        await this.getPaymentMethodById(id);

        const method = await this.prisma.paymentMethod.update({
            where: { id },
            data: body
        })

        return method;
    }

    async deletePaymentMethod(id: string) {
        await this.getPaymentMethodById(id);

        const method = await this.prisma.paymentMethod.delete({
            where: { id }
        })

        return method;
    }
}
