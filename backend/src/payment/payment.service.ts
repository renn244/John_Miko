import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentType, Prisma } from 'src/generated/prisma/client';
import { getDateRange, toDateOnly } from 'src/lib/utils/date.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { CheckoutLineItem } from './interface/paymongo.types';
import { PaymongoService } from './paymongo.service';

@Injectable()
export class PaymentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly paymongoService: PaymongoService
    ) {}

    async createPayment(
        body: CreatePaymentDto, 
        tx: Prisma.TransactionClient=this.prisma
    ) {
        const { bookingId, accommodationFee, preOrderFee, guestFee, amount } = body;

        const lineItems = this.processLineItems(accommodationFee, preOrderFee, guestFee, body.paymentType);
        const totalAmount = accommodationFee + preOrderFee + guestFee;
        const { amountToPay, amountPaid } = this.calculateAmounts(totalAmount, body.paymentType);

        // create paymongo link here
        const checkoutSession = await this.paymongoService.createCheckoutSession({
            data: {
                attributes: {
                    line_items: lineItems,
                    payment_method_types: ['card', 'gcash', 'paymaya'],
                    success_url: `${process.env.FRONTEND_URL}/payment/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
                    reference_number: bookingId,
                    show_line_items: true,
                    send_email_receipt: true,
                },
            },
        });

        // TODO LATER:
        // maybe add here a way to let user select waht to pay for,
        // but accommodatuion and guest fee is required

        // if prisma fails after session is created, expire the session
        // to avoid orphaned checkout sessions on paymongo
        const payment = await tx.payment.create({
            data: {
                bookingId,
                paymentId: checkoutSession.data.id,
                paymentStatus: 'Completed',
                accommodationAmount: accommodationFee,
                preOrderAmount: preOrderFee,
                guestFeeAmount: guestFee,
                amountPaid: amountPaid,
                amountToPaid: amountToPay,
                totalAmount: totalAmount,
            }
        }).catch(async () => {
            await this.paymongoService.expireCheckoutSession(checkoutSession.data.id);
            throw new InternalServerErrorException('Failed to save payment record');
        });

        return {
            paymentId: payment.id,
            checkoutUrl: checkoutSession.data.attributes.checkout_url
        };
    }

    async getPayments() {
    }

    async getPaymentReportBreakdown() {
        const { lte, gte } = getDateRange('day')
        const today = toDateOnly(new Date());

        const payments = await this.prisma.payment.findMany({
            where: {
                booking: {
                    bookingDate: today
                },
                paymentStatus: 'Completed',
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

    private processLineItems(accommodationFee: number, preOrderFee: number, guestFee: number, paymentType: PaymentType): CheckoutLineItem[] {
        const isPartial = paymentType === 'Partial';
        const multiplier = isPartial ? 0.5 : 1;
        const label = isPartial ? ' (50% Downpayment)' : '';

         return [
            {
                amount: Math.round(accommodationFee * multiplier) * 100,
                currency: 'PHP' as CheckoutLineItem['currency'],
                name: `Accommodation Fee${label}`,
                description: 'This is the fee for the accommodations like room, cottage, etc.',
                quantity: 1,
            },
            ...(preOrderFee > 0 ? [{
                amount: Math.round(preOrderFee * multiplier) * 100,
                currency: 'PHP' as CheckoutLineItem['currency'],
                name: `Pre-order Fee${label}`,
                description: 'This is the fee for your pre-ordered food during your stay.',
                quantity: 1,
            }] : []),
            ...(guestFee > 0 ? [{
                amount: Math.round(guestFee * multiplier) * 100,
                currency: 'PHP' as CheckoutLineItem['currency'],
                name: `Guest Fee${label}`,
                description: 'This is the fee for the guests during your stay.',
                quantity: 1,
            }] : []),
        ];
    }
}
