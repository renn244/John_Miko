import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { formatBookingDateManila, formatCurrencyPhp, getFrontendMyBookingsUrl } from 'src/lib/utils/email-format.util';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentEmailService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
    ) {}

    private async getPaymentEmailContext(paymentId: string) {
        return this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                booking: {
                    include: {
                        accommodation: {
                            select: {
                                name: true,
                                type: true,
                            },
                        },
                        preOrders: {
                            select: {
                                name: true,
                                quantity: true,
                                price: true,
                            },
                        },
                        addOns: {
                            select: {
                                name: true,
                                quantity: true,
                                price: true,
                            },
                        },
                    },
                },
                method: {
                    select: {
                        name: true,
                        type: true,
                    },
                },
            },
        });
    }

    async sendApprovedEmail(paymentId: string) {
        const payment = await this.getPaymentEmailContext(paymentId);

        if (!payment) {
            return;
        }

        await this.emailService.sendEmail({
            to: payment.booking.email,
            subject: 'Your Booking Has Been Confirmed',
            template: 'paymentApproved',
            context: {
                guestName: payment.booking.guestName,
                bookingReference: payment.booking.referenceCode ?? payment.booking.id,
                bookingDate: formatBookingDateManila(payment.booking.bookingDate),
                stayOptionLabel: payment.booking.stayOptionLabelSnapshot,
                accommodationName: payment.booking.accommodation.name,
                accommodationType: payment.booking.accommodation.type,
                guestCount: payment.booking.numberOfGuests,
                paymentType: payment.booking.paymentType,
                paymentMethodName: payment.method?.name,
                referenceNumber: payment.referenceNumber,
                totalAmount: formatCurrencyPhp(payment.totalAmount),
                amountPaid: formatCurrencyPhp(payment.amountPaid),
                remainingAmount: formatCurrencyPhp(payment.amountToPaid),
                bookingStatus: 'Confirmed',
                specialRequests: payment.booking.specialRequests,
                myBookingsUrl: getFrontendMyBookingsUrl(),
                preOrders: payment.booking.preOrders.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: formatCurrencyPhp(item.price),
                    subtotal: formatCurrencyPhp(item.price * item.quantity),
                })),
                addOns: payment.booking.addOns.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: formatCurrencyPhp(item.price),
                    subtotal: formatCurrencyPhp(item.price * item.quantity),
                })),
            },
        });
    }

    async sendRejectedEmail(paymentId: string) {
        const payment = await this.getPaymentEmailContext(paymentId);

        if (!payment) {
            return;
        }

        await this.emailService.sendEmail({
            to: payment.booking.email,
            subject: 'Your Payment Was Rejected',
            template: 'paymentRejected',
            context: {
                guestName: payment.booking.guestName,
                bookingReference: payment.booking.referenceCode ?? payment.booking.id,
                bookingDate: formatBookingDateManila(payment.booking.bookingDate),
                stayOptionLabel: payment.booking.stayOptionLabelSnapshot,
                accommodationName: payment.booking.accommodation.name,
                accommodationType: payment.booking.accommodation.type,
                paymentType: payment.booking.paymentType,
                paymentMethodName: payment.method?.name,
                referenceNumber: payment.referenceNumber,
                totalAmount: formatCurrencyPhp(payment.totalAmount),
                amountPaid: formatCurrencyPhp(payment.amountPaid),
                remainingAmount: formatCurrencyPhp(payment.amountToPaid),
                bookingStatus: 'Cancelled',
                rejectionNote: payment.rejectionNote,
                myBookingsUrl: getFrontendMyBookingsUrl(),
            },
        });
    }
}
