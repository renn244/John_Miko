import { Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymongoService } from './paymongo.service';
import { CheckoutLineItem } from './interface/paymongo.types';
import { Prisma } from 'src/generated/prisma/client';

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

        const lineItems: CheckoutLineItem[] = [
            {
                amount: accommodationFee * 100,
                currency: 'PHP' as CheckoutLineItem['currency'],
                name: 'Accommodation Fee',
                description: `This is the fee for the accommodations like room, cottage, etc.`,
                images: [''], // TODO add accommodation image here
                quantity: 1,
            },
            ...(preOrderFee > 0 ? [{
                amount: preOrderFee * 100,
                currency: 'PHP' as CheckoutLineItem['currency'],
                name: 'Pre-order Fee',
                description: `This is the fee for you're pre ordered food during your stay.`,
                quantity: 1,
            }] : []),
            ...(guestFee > 0 ? [{
                amount: guestFee * 100,
                currency: 'PHP' as CheckoutLineItem['currency'],
                name: 'Guest Fee',
                description: `This is the fee for the guests fee that comes during your stay.`,
                quantity: 1,
            }] : []),
        ];

        // create paymongo link here
        const checkoutSession = await this.paymongoService.createCheckoutSession({
            data: {
                attributes: {
                    line_items: lineItems,
                    payment_method_types: ['card', 'gcash', 'paymaya'],
                    success_url: `${process.env.FRONTEND_URL}/payment/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
                    reference_number: bookingId,
                    // show_line_items: true,
                    send_email_receipt: true,
                },
            },
        });

        // TODO LATER:
        // maybe add here a way to let user select waht to pay for,
        // but accommodatuion and guest fee is required

        // if prisma fails after session is created, expire the session
        // to avoid orphaned checkout sessions on paymongo
        const totalAmount = accommodationFee + preOrderFee + guestFee;
        const payment = await tx.payment.create({
            data: {
                bookingId,
                paymentId: checkoutSession.data.id,
                paymentStatus: 'Completed',
                accommodationAmount: accommodationFee,
                preOrderAmount: preOrderFee,
                guestFeeAmount: guestFee,
                amount: totalAmount,
            }
        }).catch(async () => {
            await this.paymongoService.expireCheckoutSession(checkoutSession.data.id);
            throw new InternalServerErrorException('Failed to save payment record');
        });

        // return paymongo link here
        return {
            paymentId: payment.id,
            checkoutUrl: checkoutSession.data.attributes.checkout_url
        };
    }

    async getPayments() {

    }

    async getPaymentById(id: string) {
    }

    async addExtraFees() {
        
    }
}
