import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Prisma } from 'src/generated/prisma/client';
import { PaymentStatus, PaymentType } from 'src/generated/prisma/enums';
import { toDateOnly } from 'src/lib/utils/date.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentEmailService } from './payment-email.service';

@Injectable()
export class PaymentService {
    private static readonly PRIVATE_CLOSURE_REVENUE = 35000;

    constructor(
        private readonly prisma: PrismaService,
        private readonly paymentEmailService: PaymentEmailService,
    ) {}

    private getMonthKey(date: Date) {
        return toDateOnly(date).toISOString().slice(0, 7);
    }

    private isRevenueEligiblePrivateClosure(closure: { accommodationId: string | null; type: string }) {
        return closure.accommodationId === null && closure.type === 'Private';
    }

    private async getQualifyingPrivateClosures(where: Prisma.ClosureWhereInput = {}) {
        return this.prisma.closure.findMany({
            where: {
                accommodationId: null,
                type: 'Private',
                ...where,
            },
            select: {
                id: true,
                date: true,
                type: true,
                accommodationId: true,
            }
        });
    }

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

    async createManualPayment(
        body: {
            bookingId: string;
            accommodationFee: number;
            preOrderFee: number;
            addOnServiceFee: number;
            guestFee: number;
            paymentType: PaymentType;
            verifiedById: string;
        },
        tx: Prisma.TransactionClient = this.prisma
    ) {
        const totalAmount = body.accommodationFee + body.preOrderFee + body.addOnServiceFee + body.guestFee;
        const { amountToPay, amountPaid } = this.calculateAmounts(totalAmount, body.paymentType);

        const referenceNumber = await this.generateReferenceNumber(tx);
        const verifiedAt = new Date();

        const payment = await tx.payment.create({
            data: {
                bookingId: body.bookingId,
                referenceNumber,
                status: PaymentStatus.Approved,
                accommodationAmount: body.accommodationFee,
                preOrderAmount: body.preOrderFee,
                addOnAmount: body.addOnServiceFee,
                guestFeeAmount: body.guestFee,
                amountPaid,
                amountToPaid: amountToPay,
                totalAmount,
                verifiedAt,
                verifiedById: body.verifiedById,
                paidAt: verifiedAt,
            }
        }).catch(() => {
            throw new InternalServerErrorException('Failed to save payment record');
        });

        return {
            paymentId: payment.id,
            referenceNumber: payment.referenceNumber
        };
    }

    async sendApprovedPaymentEmail(paymentId: string) {
        await this.paymentEmailService.sendApprovedEmail(paymentId);
    }

    async getPayments() {
        const payments = await this.prisma.payment.findMany({
            include: {
                booking: {
                    select: {
                        id: true,
                        bookingDate: true,
                        stayOptionLabelSnapshot: true,
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

        return payments.map((payment) => ({
            ...payment,
            booking: {
                ...payment.booking,
                timeSlot: payment.booking.stayOptionLabelSnapshot,
            }
        }));
    }

    async getRevenueAnalytics() {
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 1);

        const [payments, privateClosures] = await Promise.all([
            this.prisma.payment.findMany({
                where: {
                    status: 'Approved',
                    createdAt: { gt: cutoff },
                },
                select: {
                    createdAt: true,
                    totalAmount: true,
                    accommodationAmount: true,
                    preOrderAmount: true,
                    addOnAmount: true,
                    guestFeeAmount: true,
                }
            }),
            this.getQualifyingPrivateClosures({
                date: { gt: toDateOnly(cutoff) }
            }),
        ]);

        const analyticsMap = new Map<string, {
            month: string;
            count: number;
            totalamount: number;
            accommodationamount: number;
            preorderamount: number;
            addonamount: number;
            guestfeeamount: number;
            privateclosurerevenueamount: number;
        }>();

        const ensureMonth = (month: string) => {
            if (!analyticsMap.has(month)) {
                analyticsMap.set(month, {
                    month,
                    count: 0,
                    totalamount: 0,
                    accommodationamount: 0,
                    preorderamount: 0,
                    addonamount: 0,
                    guestfeeamount: 0,
                    privateclosurerevenueamount: 0,
                });
            }

            return analyticsMap.get(month)!;
        };

        payments.forEach((payment) => {
            const month = this.getMonthKey(payment.createdAt);
            const bucket = ensureMonth(month);

            bucket.count += 1;
            bucket.totalamount += payment.totalAmount;
            bucket.accommodationamount += payment.accommodationAmount;
            bucket.preorderamount += payment.preOrderAmount;
            bucket.addonamount += payment.addOnAmount;
            bucket.guestfeeamount += payment.guestFeeAmount;
        });

        privateClosures
            .filter((closure) => this.isRevenueEligiblePrivateClosure(closure))
            .forEach((closure) => {
            const month = this.getMonthKey(closure.date);
            const bucket = ensureMonth(month);

            bucket.count += 1;
            bucket.totalamount += PaymentService.PRIVATE_CLOSURE_REVENUE;
            bucket.privateclosurerevenueamount += PaymentService.PRIVATE_CLOSURE_REVENUE;
        });

        return Array.from(analyticsMap.values()).sort((a, b) => a.month.localeCompare(b.month));
    }

    async getPaymentReportBreakdown(date?: Date) {
        const reportDate = toDateOnly(date ?? new Date());

        const [payments, privateClosures] = await Promise.all([
            this.prisma.payment.findMany({
                where: {
                    booking: {
                        bookingDate: reportDate
                    },
                    status: 'Approved',
                }
            }),
            this.getQualifyingPrivateClosures({
                date: reportDate,
            }),
        ]);
        
        const reportData: Record<string, number> = payments.reduce((acc, payment) => ({
            accommodationFee: acc.accommodationFee + payment.accommodationAmount,
            preOrderFee: acc.preOrderFee + payment.preOrderAmount,
            addOnServiceFee: acc.addOnServiceFee + payment.addOnAmount,
            guestFee: acc.guestFee + payment.guestFeeAmount,
            privateClosureRevenue: acc.privateClosureRevenue,
            totalRevenue:
                acc.totalRevenue +
                payment.accommodationAmount +
                payment.preOrderAmount +
                payment.addOnAmount +
                payment.guestFeeAmount,
        }), {
            accommodationFee: 0,
            preOrderFee: 0,
            addOnServiceFee: 0,
            guestFee: 0,
            privateClosureRevenue: 0,
            totalRevenue: 0,
        })

        reportData.privateClosureRevenue =
            privateClosures.filter((closure) => this.isRevenueEligiblePrivateClosure(closure)).length *
            PaymentService.PRIVATE_CLOSURE_REVENUE;
    
        return reportData;
    }

    async getPaymentOverview(date?: Date) {
        const report = await this.getPaymentReportBreakdown(date);
        const todayRevenue = report.totalRevenue + report.privateClosureRevenue;

        const [pendingReviewCount, pendingPayments] = await Promise.all([
            this.prisma.payment.count({
                where: { status: PaymentStatus.Pending },
            }),
            this.prisma.payment.findMany({
                where: { status: PaymentStatus.Pending },
                select: {
                    id: true,
                    bookingId: true,
                    status: true,
                    referenceNumber: true,
                    proofImageUrl: true,
                    amountPaid: true,
                    amountToPaid: true,
                    totalAmount: true,
                    createdAt: true,
                    method: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        },
                    },
                    booking: {
                        select: {
                            id: true,
                            referenceCode: true,
                            guestName: true,
                            bookingDate: true,
                            stayOptionLabelSnapshot: true,
                            status: true,
                            accommodation: {
                                select: {
                                    id: true,
                                    name: true,
                                    type: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        return {
            todayRevenue,
            pendingReviewCount,
            pendingPayments,
            revenueBreakdown: {
                ...report,
                totalRevenue: todayRevenue,
            },
        };
    }

    async getPaymentById(id: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                booking: {
                    select: {
                        id: true,
                        bookingDate: true,
                        stayOptionLabelSnapshot: true,
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

        return {
            ...payment,
            booking: {
                ...payment.booking,
                timeSlot: payment.booking.stayOptionLabelSnapshot,
            }
        };
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

        await this.paymentEmailService.sendApprovedEmail(updatedPayment.id);

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

        await this.paymentEmailService.sendRejectedEmail(updatedPayment.id);

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
