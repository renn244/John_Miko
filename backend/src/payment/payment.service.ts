import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Prisma } from 'src/generated/prisma/client';
import { PaymentStatus, PaymentType } from 'src/generated/prisma/enums';
import { getDateRange, toDateOnly } from 'src/lib/utils/date.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createPayment(
        body: CreatePaymentDto, 
        tx: Prisma.TransactionClient=this.prisma
    ) {
        const { bookingId, accommodationFee, preOrderFee, addOnServiceFee, guestFee } = body;
        const totalAmount = accommodationFee + preOrderFee + addOnServiceFee + guestFee;
        const { amountToPay, amountPaid } = this.calculateAmounts(totalAmount, body.paymentType);

        const referenceNumber = await this.generateReferenceNumber(tx);

        const payment = await tx.payment.create({
            data: {
                bookingId,
                methodId: body.methodId,
                proofImageUrl: body.proofImageUrl,
                referenceNumber,
                status: PaymentStatus.Pending,
                accommodationAmount: accommodationFee,
                preOrderAmount: preOrderFee,
                addOnAmount: addOnServiceFee,
                guestFeeAmount: guestFee,
                amountPaid: amountPaid,
                amountToPaid: amountToPay,
                totalAmount: totalAmount,
            }
        }).catch(() => {
            throw new InternalServerErrorException('Failed to save payment record');
        });

        return {
            paymentId: payment.id,
            referenceNumber: payment.referenceNumber
        };
    }

    async getPayments() {
        const payments = await this.prisma.payment.findMany({
            include: {
                booking: {
                    select: {
                        id: true,
                        bookingDate: true,
                        timeSlot: true,
                        guestName: true,
                        email: true,
                        contactNo: true,
                        status: true,
                        accommodation: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                imageUrl: true,
                            }
                        }
                    }
                },
                method: true,
                verifiedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return payments;
    }

    async getRevenueAnalytics() {
        const revenueAnalytics = await this.prisma.$queryRaw`
            SELECT
                TO_CHAR("createdAt", 'YYYY-MM') as month,
                COUNT(id)::int as count,
                SUM("totalAmount")::int as totalamount,
                SUM("accommodationAmount")::int as accommodationamount,
                SUM("preOrderAmount")::int as preorderAmount,
                SUM("addOnAmount")::int as addonamount,
                SUM("guestFeeAmount")::int as guestfeeAmount
            FROM "Payment"
            WHERE 
                "status" = 'Approved' and
                "createdAt" > NOW() - INTERVAL '1 year'
            GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
            ORDER BY month ASC
        `

        return revenueAnalytics
    }

    async getPaymentReportBreakdown() {
        const { lte, gte } = getDateRange('day')
        const today = toDateOnly(new Date());

        const payments = await this.prisma.payment.findMany({
            where: {
                booking: {
                    bookingDate: today
                },
                status: 'Approved',
            }
        })   
        
        const reportData: Record<string, number> = payments.reduce((acc, payment) => ({
            accommodationFee: acc.accommodationFee + payment.accommodationAmount,
            preOrderFee: acc.preOrderFee + payment.preOrderAmount,
            guestFee: acc.guestFee + payment.guestFeeAmount,
            paidOnBooking: acc.paidOnBooking + payment.amountPaid,
            paidOnCash: acc.paidOnCash + payment.amountToPaid,
        }), { accommodationFee: 0, preOrderFee: 0, guestFee: 0, paidOnBooking: 0, paidOnCash: 0 })
    
        return reportData;
    }

    async getPaymentById(id: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                booking: {
                    select: {
                        id: true,
                        bookingDate: true,
                        timeSlot: true,
                        guestName: true,
                        email: true,
                        contactNo: true,
                        status: true,
                        accommodation: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                imageUrl: true,
                            }
                        }
                    }
                },
                method: true,
                verifiedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        if(!payment) {
            throw new NotFoundException('Payment not found');
        }

        return payment;
    }

    async approvePayment(id: string, verifiedById: string) {
        const payment = await this.prisma.payment.findUnique({ where: { id } })

        if(!payment) {
            throw new NotFoundException('Payment not found');
        }

        const verifiedAt = new Date();

        const updatedPayment = await this.prisma.$transaction(async (tx) => {
            const nextPayment = await tx.payment.update({
                where: { id },
                data: {
                    status: PaymentStatus.Approved,
                    rejectionNote: null,
                    verifiedAt,
                    verifiedById,
                    paidAt: verifiedAt
                }
            })

            await tx.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'Confirmed' }
            })

            return nextPayment;
        })

        return updatedPayment;
    }

    async rejectPayment(id: string, rejectionNote: string, verifiedById: string) {
        const payment = await this.prisma.payment.findUnique({ where: { id } })

        if(!payment) {
            throw new NotFoundException('Payment not found');
        }

        const verifiedAt = new Date();

        const updatedPayment = await this.prisma.$transaction(async (tx) => {
            const nextPayment = await tx.payment.update({
                where: { id },
                data: {
                    status: PaymentStatus.Rejected,
                    rejectionNote,
                    verifiedAt,
                    verifiedById,
                }
            })

            await tx.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'Cancelled' }
            })

            return nextPayment;
        })

        return updatedPayment;
    }

    async addExtraFees() {
        
    }

    private calculateAmounts(totalAmount: number, paymentType: PaymentType) {
        let amountToPay = 0;
        let amountPaid = 0;

        if(paymentType === 'Full') {
            amountPaid = totalAmount;
        } else {
            // since partial is 50%
            amountPaid = Math.round(totalAmount / 2); 
            amountToPay = totalAmount - amountPaid;
        }

        return { amountToPay, amountPaid };
    }

    private async generateReferenceNumber(tx: Prisma.TransactionClient) {
        for (let attempt = 0; attempt < 5; attempt++) {
            const stamp = Date.now().toString(36).toUpperCase();
            const randomPart = randomBytes(3).toString('hex').toUpperCase();
            const referenceNumber = `JM-${stamp}-${randomPart}`;

            const existing = await tx.payment.findUnique({ where: { referenceNumber } })

            if(!existing) {
                return referenceNumber;
            }
        }

        throw new InternalServerErrorException('Failed to generate reference number');
    }
}
