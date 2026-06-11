import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AccommodationStayOption, Prisma } from 'src/generated/prisma/client';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { ValidationException } from 'src/lib/exception/ValidationException';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PaymentService } from 'src/payment/payment.service';
import { PreOrderService } from 'src/pre-order/pre-order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingServicesService } from 'src/services/booking-services.service';
import { ChangeStatusDto, CreateBookingDto, RescheduleBookingDto } from './dto/booking.dto';
import { GetBookingsByUserQuery, GetBookingsQuery } from './query/getBookings.query';
import { ClosureService } from 'src/closure/closure.service';

@Injectable()
export class BookingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly preOrderService: PreOrderService,
        private readonly bookingServicesService: BookingServicesService,
        private readonly paymentService: PaymentService,
        private readonly closureService: ClosureService
    ) {}

    private calculateGuestFee(adultGuests: number, seniorGuests: number, kidGuests: number, stayOptionCode: string) {
        const adultFee = stayOptionCode.toLowerCase() === 'daystay' ? 150 : 180 // full price
        const seniorFee = adultFee - (adultFee * 0.20); // 20 percent discount
        const kidsFee = 100 // just a kid 4-7 years old

        const adultTotal = adultGuests * adultFee;
        const seniorTotal = seniorGuests * seniorFee;
        const kidsTotal = kidGuests * kidsFee; 

        return adultTotal + seniorTotal + kidsTotal
    }

    private async findStayOptionOrThrow(accommodationId: string, stayOptionId: string, tx: Prisma.TransactionClient = this.prisma) {
        const stayOption = await tx.accommodationStayOption.findFirst({
            where: {
                id: stayOptionId,
                accommodationId,
                isActive: true,
            }
        });

        if(!stayOption) {
            throw new NotFoundException('Stay option not found for this accommodation')
        }

        return stayOption;
    }

    async bookAccommodation(body: CreateBookingDto, user: UserSession) {

        // this sohuld be on the accommodation module
        const accommodation = await this.prisma.accommodation.findUnique({ where: { id: body.accommodationId } })

        if(!accommodation) {
            throw new NotFoundException('Accommodation not found')
        }

        if(!body.adultGuests  && !body.seniorGuests && !body.kidGuests) {
            throw new ValidationException({
                field: 'numberOfGuests',
                message: ["at least 1 guests is required"]
            })
        }
   
        const booking = await this.prisma.$transaction(async (txprisma) => {
            const stayOption = await this.findStayOptionOrThrow(body.accommodationId, body.stayOptionId, txprisma);

            const existingBooking = await txprisma.booking.findFirst({
                where: {
                    accommodationId: body.accommodationId,
                    bookingDate: body.checkIn,
                    stayOptionId: body.stayOptionId,
                    status: { notIn: ['Cancelled'] }
                },
                select: { id: true }
            })

            if(existingBooking) {
                throw new ConflictException('Accommodation is already booked for the selected date and time slot')
            }
            
            const isClosed = await this.closureService.validateClosureDate(body.accommodationId, body.checkIn);

            if(isClosed) {
                throw new ConflictException('Accommodation is closed for the selected date')
            }

            const newBooking = await this.createBooking(body, user, stayOption, txprisma);

            const { total: preOrderTotal } = await this.preOrderService.createBulkPreOrder(newBooking.id, body.preOrderItems || [], txprisma);
            const guestFeeTotal = this.calculateGuestFee(body.adultGuests, body.seniorGuests, body.kidGuests, stayOption.code)

            const { total: addOnServiceTotal } = await this.bookingServicesService.createBulk(newBooking.id, body.addOnServices || [], txprisma);

            await txprisma.bookedAccommodation.create({
                data: {
                    bookingId: newBooking.id,
                    name: accommodation.name,
                    type: accommodation.type,
                    price: accommodation.price,
                    imageUrl: accommodation.imageUrl,
                    capacity: accommodation.capacity,
                    description: accommodation.description,
                    amenities: accommodation.amenities,
                }
            })

            const { paymentId, referenceNumber } = await this.paymentService.createPayment({
                bookingId: newBooking.id,
                methodId: body.paymentMethodId,
                proofImageUrl: body.proofImageUrl,
                accommodationFee: accommodation.price,
                guestFee: guestFeeTotal,
                preOrderFee: preOrderTotal,
                addOnServiceFee: addOnServiceTotal,
                paymentType: body.paymentType,
            }, txprisma)

            return {
                ...newBooking,
                paymentId,
                referenceNumber
            }
        })

        // send a receipt email to the user with the booking details and the accommodation details
        

        return booking
    }

    async createBooking(body: CreateBookingDto, user: UserSession, stayOption: AccommodationStayOption, tx: Prisma.TransactionClient) {
        const totalNumberofGuest = body.seniorGuests + body.adultGuests + body.kidGuests

        const newBooking = await tx.booking.create({
            data: {
                userId: user.id,
                accommodationId: body.accommodationId,
                bookingDate: body.checkIn,
                stayOptionId: body.stayOptionId,
                stayOptionCodeSnapshot: stayOption.code,
                stayOptionLabelSnapshot: stayOption.label,
                stayDurationHoursSnapshot: stayOption.durationHours,
                paymentType: body.paymentType,
                numberOfGuests: totalNumberofGuest,
                specialRequests: body.specialRequest,
                guestName: body.name,
                email: body.email,
                contactNo: body.contactNo,
                kidGuests: body.kidGuests,
                adultGuests: body.adultGuests,
                seniorGuest: body.seniorGuests,
                status: 'Pending'
            }
        })
          
        return newBooking;
    }

    async getBookings(query: GetBookingsQuery) {
        const currentDate = new Date();
        const { search, page, limit, bookingDate, ...rest } = cleanPrismaWhere(query)

        const searchFilter = search ? {
            OR: [
                { id: { contains: search, mode: 'insensitive' as const } },
                { guestName: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {}

        const bookingDateFilter = bookingDate
            ? { bookingDate }
            : { bookingDate: { gte: currentDate } }

        const where = {
            ...bookingDateFilter,
            ...rest,
            ...searchFilter,
        }

        const [data, total] = await Promise.all([
            this.prisma.booking.findMany({
                where,
                include: {
                    accommodation: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            imageUrl: true,
                        }
                    },
                    stayOption: true,
                },
                ...getPaginationArgs(page, limit),
                orderBy: { bookingDate: 'desc' }
            }),
            this.prisma.booking.count({ where })
        ])

        return {
            data,
            meta: getPaginationMeta(total, page, limit)
        }
    }

    async getBookingsByAccommodation(accommodationId: string) {
        const bookings = await this.prisma.booking.findMany({
            where: { 
                accommodationId: accommodationId,
                bookingDate: { gte: new Date() },
                status: { 
                    notIn: ['Cancelled']
                }
            },
            select: {
                bookingDate: true,
                stayOptionId: true,
                stayOptionLabelSnapshot: true,
            },
        })

        const groupMap = new Map<string, { id: string, label: string }[]>()
        bookings.forEach(booking => {
            const dateKey = booking.bookingDate.toISOString().split('T')[0]

            if(!groupMap.has(dateKey)) {
                groupMap.set(dateKey, [])
            }

            groupMap.get(dateKey)?.push({
                id: booking.stayOptionId,
                label: booking.stayOptionLabelSnapshot
            })
        })

        const activeStayOptionCount = await this.prisma.accommodationStayOption.count({
            where: { accommodationId, isActive: true }
        });

        const result = Array.from(groupMap.entries()).map(([date, stayOptions]) => {
            const bookingStatus = stayOptions.length >= activeStayOptionCount ? 'Full' : 'Partial';

            return {
                bookingDate: date,
                bookingStatus,
                timeSlotsOccupied: stayOptions.map((option) => option.id),
                stayOptionsOccupied: stayOptions
            }
        })

        return result
    }

    async getBookingsForClosure(accommodationId?: string) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                accommodationId: accommodationId,
                bookingDate: { gte: new Date() },
                status: {
                    notIn: ['Cancelled']
                }
            },
            select: { bookingDate: true, id: true },
            orderBy: { bookingDate: 'asc' }
        });

        const groupMap = new Map<string, string[]>();
        bookings.forEach(booking => {
            const dateKey = booking.bookingDate.toISOString().split('T')[0];

            if(!groupMap.has(dateKey)) {
                groupMap.set(dateKey, []);
            }

            groupMap.get(dateKey)?.push(booking.id)
        })

        const result = Array.from(groupMap.entries()).map(([date, bookingIds]) => {
            return { bookingDate: date, bookingIds }
        })

        return result
    }

    async getBookingById(bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                accommodation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        imageUrl: true,
                    }
                },
                payment: {
                    select: {
                        id: true,
                        status: true,
                        referenceNumber: true,
                        proofImageUrl: true,
                        rejectionNote: true,
                        verifiedAt: true,
                        method: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                accountName: true,
                                accountNumber: true,
                                instructions: true,
                                qrCodeUrl: true,
                            }
                        },
                        accommodationAmount: true,
                        preOrderAmount: true,
                        addOnAmount: true,
                        guestFeeAmount: true,
                        amountPaid: true,
                        amountToPaid: true,
                        totalAmount: true,
                    },
                },
                preOrders: true,
                addOns: true,
                stayOption: true,
            }
        })

        if(!booking) {
            throw new NotFoundException('Booking not found')
        }

        return booking
    }

    async getBookingsByUser(user: UserSession, query: GetBookingsByUserQuery) {
        const { status } = cleanPrismaWhere(query);

        const bookings = await this.prisma.booking.findMany({
            where: { userId: user.id, status },
            include: {
                accommodation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        imageUrl: true
                    }
                },
                feedback: true,
                stayOption: true,
            }
        })

        return bookings 
    }

    async rescheduleBooking(bookingId: string, body: RescheduleBookingDto) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } })

        if(!booking) {
            throw new NotFoundException('Booking not found')
        }

        const stayOption = await this.findStayOptionOrThrow(booking.accommodationId, body.stayOptionId);

        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                accommodationId: booking.accommodationId,
                bookingDate: body.bookingDate,
                stayOptionId: body.stayOptionId,
                status: { not: 'Cancelled' },
                id: { not: bookingId } //  exclude self to avoid false conflict
            }
        })

        if(existingBooking) {
            throw new ConflictException('A booking already exists for the selected date and time slot')
        }

        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                bookingDate: body.bookingDate,
                stayOptionId: body.stayOptionId,
                stayOptionCodeSnapshot: stayOption.code,
                stayOptionLabelSnapshot: stayOption.label,
                stayDurationHoursSnapshot: stayOption.durationHours,
            }
        })

        // send an email to the user about the rescheduled booking details

        return updatedBooking
    }

    async changeStatus(bookingId: string, body: ChangeStatusDto) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } })

        if(!booking) {
            throw new NotFoundException('Booking not found');
        }

        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: body.status }
        })

        // send an email to the user about the booking status change

        return updatedBooking
    }
}
