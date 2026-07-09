import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { BookingStatus } from 'src/generated/prisma/enums';
import { formatBookingDateManila, formatCurrencyPhp, getFrontendMyBookingsUrl } from 'src/lib/utils/email-format.util';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingEmailService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
    ) {}

    private formatBookingStatus(status: BookingStatus) {
        switch (status) {
            case BookingStatus.Pending:
                return 'Pending';
            case BookingStatus.Confirmed:
                return 'Confirmed';
            case BookingStatus.Cancelled:
                return 'Cancelled';
            case BookingStatus.Completed:
                return 'Completed';
            default:
                return status;
        }
    }

    private getStatusEmailSubject(status: BookingStatus) {
        switch (status) {
            case BookingStatus.Confirmed:
                return 'Your Booking Has Been Confirmed';
            case BookingStatus.Cancelled:
                return 'Your Booking Has Been Cancelled';
            case BookingStatus.Completed:
                return 'Your Booking Has Been Marked Completed';
            default:
                return 'Your Booking Status Has Been Updated';
        }
    }

    private getStatusEmailMessage(status: BookingStatus) {
        switch (status) {
            case BookingStatus.Confirmed:
                return 'Your booking has been confirmed by the resort. Please keep this email for your reference before arrival.';
            case BookingStatus.Cancelled:
                return 'Your booking has been cancelled. If you have questions about the cancellation, please contact the resort directly.';
            case BookingStatus.Completed:
                return 'Your booking has been marked as completed. Thank you for staying with John Miko\'s Place.';
            default:
                return 'Your booking status has been updated. Please review the latest details below.';
        }
    }

    private getStatusBadgeConfig(status: BookingStatus) {
        switch (status) {
            case BookingStatus.Completed:
                return {
                    badgeLabel: 'Booking Completed',
                    badgeBackgroundColor: '#ecfdf5',
                    badgeBorderColor: '#a7f3d0',
                    badgeTextColor: '#047857',
                    showStatusDetails: false,
                };
            case BookingStatus.Confirmed:
                return {
                    badgeLabel: 'Status: Confirmed',
                    badgeBackgroundColor: '#ecfdf5',
                    badgeBorderColor: '#a7f3d0',
                    badgeTextColor: '#047857',
                    showStatusDetails: true,
                };
            case BookingStatus.Cancelled:
                return {
                    badgeLabel: 'Status: Cancelled',
                    badgeBackgroundColor: '#fef2f2',
                    badgeBorderColor: '#fecaca',
                    badgeTextColor: '#b91c1c',
                    showStatusDetails: true,
                };
            default:
                return {
                    badgeLabel: `Status: ${this.formatBookingStatus(status)}`,
                    badgeBackgroundColor: '#f1f5f9',
                    badgeBorderColor: '#e2e8f0',
                    badgeTextColor: '#334155',
                    showStatusDetails: true,
                };
        }
    }

    async sendCancelledEmail(params: {
        bookingReference: string;
        guestName: string;
        email: string;
        accommodationName: string;
        accommodationType?: string;
        bookingDate: Date;
        stayOptionLabel: string;
    }) {
        await this.emailService.sendEmail({
            to: params.email,
            subject: 'Your Booking Has Been Cancelled',
            template: 'bookingCancelled',
            context: {
                guestName: params.guestName,
                bookingReference: params.bookingReference,
                bookingDate: formatBookingDateManila(params.bookingDate),
                stayOptionLabel: params.stayOptionLabel,
                accommodationName: params.accommodationName,
                accommodationType: params.accommodationType,
                bookingStatus: 'Cancelled',
                myBookingsUrl: getFrontendMyBookingsUrl(),
            },
        });
    }

    async sendSubmittedEmail(bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                accommodation: {
                    select: {
                        name: true,
                        type: true,
                    },
                },
                payment: {
                    include: {
                        method: {
                            select: {
                                name: true,
                                type: true,
                            },
                        },
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
        });

        if (!booking || !booking.payment) {
            return;
        }

        await this.emailService.sendEmail({
            to: booking.email,
            subject: 'Your Booking Request Has Been Submitted',
            template: 'bookingSubmitted',
            context: {
                guestName: booking.guestName,
                bookingReference: booking.referenceCode ?? booking.id,
                bookingDate: formatBookingDateManila(booking.bookingDate),
                stayOptionLabel: booking.stayOptionLabelSnapshot,
                accommodationName: booking.accommodation.name,
                accommodationType: booking.accommodation.type,
                guestCount: booking.numberOfGuests,
                paymentType: booking.paymentType,
                paymentMethodName: booking.payment.method?.name,
                referenceNumber: booking.payment.referenceNumber,
                totalAmount: formatCurrencyPhp(booking.payment.totalAmount),
                amountPaid: formatCurrencyPhp(booking.payment.amountPaid),
                remainingAmount: formatCurrencyPhp(booking.payment.amountToPaid),
                bookingStatus: this.formatBookingStatus(booking.status),
                specialRequests: booking.specialRequests,
                myBookingsUrl: getFrontendMyBookingsUrl(),
                preOrders: booking.preOrders.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: formatCurrencyPhp(item.price),
                    subtotal: formatCurrencyPhp(item.price * item.quantity),
                })),
                addOns: booking.addOns.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: formatCurrencyPhp(item.price),
                    subtotal: formatCurrencyPhp(item.price * item.quantity),
                })),
            },
        });
    }

    async sendRescheduledEmail(params: {
        bookingReference: string;
        guestName: string;
        email: string;
        accommodationName: string;
        previousBookingDate: Date;
        previousStayOptionLabel: string;
        newBookingDate: Date;
        newStayOptionLabel: string;
    }) {
        await this.emailService.sendEmail({
            to: params.email,
            subject: 'Your Booking Schedule Has Been Updated',
            template: 'bookingRescheduled',
            context: {
                guestName: params.guestName,
                bookingReference: params.bookingReference,
                accommodationName: params.accommodationName,
                previousBookingDate: formatBookingDateManila(params.previousBookingDate),
                previousStayOptionLabel: params.previousStayOptionLabel,
                newBookingDate: formatBookingDateManila(params.newBookingDate),
                newStayOptionLabel: params.newStayOptionLabel,
            },
        });
    }

    async sendStatusUpdatedEmail(params: {
        bookingReference: string;
        guestName: string;
        email: string;
        accommodationName: string;
        bookingDate: Date;
        stayOptionLabel: string;
        status: BookingStatus;
    }) {
        const badgeConfig = this.getStatusBadgeConfig(params.status);

        await this.emailService.sendEmail({
            to: params.email,
            subject: this.getStatusEmailSubject(params.status),
            template: 'bookingStatusUpdated',
            context: {
                guestName: params.guestName,
                bookingReference: params.bookingReference,
                accommodationName: params.accommodationName,
                bookingDate: formatBookingDateManila(params.bookingDate),
                stayOptionLabel: params.stayOptionLabel,
                status: this.formatBookingStatus(params.status),
                statusMessage: this.getStatusEmailMessage(params.status),
                ...badgeConfig,
            },
        });
    }
}
