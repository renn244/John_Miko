import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { BookingTimeSlot } from 'src/generated/prisma/enums';
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

    private calculateGuestFee(adultGuests: number, seniorGuests: number, kidGuests: number, timeSlot: BookingTimeSlot) {
        const adultFee = timeSlot === 'DayStay' ? 150 : 180 // full price
        const seniorFee = adultFee - (adultFee * 0.20); // 20 percent discount
        const kidsFee = 100 // just a kid 4-7 years old

        const adultTotal = adultGuests * adultFee;
        const seniorTotal = seniorGuests * seniorFee;
        const kidsTotal = kidGuests * kidsFee; 

        return adultTotal + seniorTotal + kidsTotal
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
            const existingBooking = await txprisma.booking.findFirst({
                where: {
                    accommodationId: body.accommodationId,
                    bookingDate: body.checkIn,
                    timeSlot: body.stayType,
                    status: { notIn: ['Cancelled', 'Pending'] } // ask benef if he allowed pending as reservation fi there is already a receipt
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

            const newBooking = await this.createBooking(body, user, txprisma);

            const { total: preOrderTotal } = await this.preOrderService.createBulkPreOrder(newBooking.id, body.preOrderItems || [], txprisma);
            const guestFeeTotal = this.calculateGuestFee(body.adultGuests, body.seniorGuests, body.kidGuests, body.stayType)

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

            const { paymentId, checkoutUrl } = await this.paymentService.createPayment({
                bookingId: newBooking.id,
                accommodationFee: accommodation.price,
                guestFee: guestFeeTotal,
                preOrderFee: preOrderTotal,
                addOnServiceFee: addOnServiceTotal,
                amount: accommodation.price + guestFeeTotal + preOrderTotal,
                paymentType: body.paymentType,
            }, txprisma)

            return {
                ...newBooking,
                paymentId,
                checkoutUrl
            }
        })

        // send a receipt email to the user with the booking details and the accommodation details
        

        return booking
    }

    async createBooking(body: CreateBookingDto, user: UserSession, tx: Prisma.TransactionClient) {
        const totalNumberofGuest = body.seniorGuests + body.adultGuests + body.kidGuests

        const newBooking = await tx.booking.create({
            data: {
                userId: user.id,
                accommodationId: body.accommodationId,
                bookingDate: body.checkIn,
                timeSlot: body.stayType,
                paymentType: body.paymentType,
                numberOfGuests: totalNumberofGuest,
                specialRequests: body.specialRequest,
                guestName: body.name,
                email: body.email,
                contactNo: body.contactNo,
                kidGuests: body.kidGuests,
                adultGuests: body.adultGuests,
                seniorGuest: body.seniorGuests,
                status: 'Confirmed'
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
                    }
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
                    notIn: ['Cancelled', 'Pending']
                }
            },
            select: { bookingDate: true, timeSlot: true },
        })

        const groupMap = new Map<string, BookingTimeSlot[]>()
        bookings.forEach(booking => {
            const dateKey = booking.bookingDate.toISOString().split('T')[0]

            if(!groupMap.has(dateKey)) {
                groupMap.set(dateKey, [])
            }

            groupMap.get(dateKey)?.push(booking.timeSlot)
        })

        const result = Array.from(groupMap.entries()).map(([date, timeSlots]) => {
            const hasDayStay = timeSlots.includes('DayStay');
            const hasOverNight = timeSlots.includes('OverNight');

            const bookingStatus = hasDayStay && hasOverNight ? 'Full' : 'Partial';

            return { bookingDate: date, bookingStatus, timeSlotsOccupied: timeSlots }
        })

        return result
    }

    async getBookingsForClosure(accommodationId?: string) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                accommodationId: accommodationId,
                bookingDate: { gte: new Date() },
                status: {
                    notIn: ['Cancelled', 'Pending']
                }
            },
            select: { bookingDate: true, timeSlot: true, id: true },
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
                        paymentStatus: true,
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
                feedback: true
            }
        })

        return bookings 
    }

    async rescheduleBooking(bookingId: string, body: RescheduleBookingDto) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } })

        if(!booking) {
            throw new NotFoundException('Booking not found')
        }

        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                accommodationId: booking.accommodationId,
                bookingDate: body.bookingDate,
                timeSlot: body.stayType,
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
                timeSlot: body.stayType
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