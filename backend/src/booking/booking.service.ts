import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingTimeSlot } from 'src/generated/prisma/enums';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto, RescheduleBookingDto } from './dto/booking.dto';
import { GetBookingsQuery } from './query/getBookings.query';

@Injectable()
export class BookingService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async bookAccommodation(body: CreateBookingDto, user: UserSession) {
        
        const accommodation = await this.prisma.accommodation.findUnique({ where: { id: body.accommodationId } })

        if(!accommodation) {
            throw new NotFoundException('Accommodation not found')
        }
        
        const booking = await this.prisma.$transaction(async (txprisma) => {
            const existingBooking = await txprisma.booking.findFirst({
                where: {
                    accommodationId: body.accommodationId,
                    bookingDate: body.checkIn,
                    timeSlot: body.stayType,
                    status: { not: 'Cancelled' }
                }
            })

            if(existingBooking) {
                throw new ConflictException('Accommodation is already booked for the selected date and time slot')
            }
            
            const newBooking = await txprisma.booking.create({
                data: {
                    userId: user.id,
                    accommodationId: body.accommodationId,
                    bookingDate: body.checkIn,
                    timeSlot: body.stayType,
                    paymentType: body.paymentType,
                    numberOfGuests: body.numberOfGuests,
                    specialRequests: body.specialRequest,
                    guestName: body.name,
                    email: body.email,
                    contactNo: body.contactNo,
                }
            })

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

            return newBooking
        })

        // send a receipt email to the user with the booking details and the accommodation details

        return booking
    }

    async getBookings(query: GetBookingsQuery) {
        const currentDate = new Date();

        const { search, bookingDate, ...rest } = cleanPrismaWhere(query);

        const searchFilter = search ? {
            OR: [
                { id: { contains: search, mode: 'insensitive' } },
                { accommodation: { name: { contains: search, mode: 'insensitive' } } }
            ]
        } : {} as any;

        const bookingDateFilter = bookingDate ? {
            bookingDate: bookingDate
        } : { bookingDate: { gte: currentDate } };

        const bookings = await this.prisma.booking.findMany({
            where: { 
                ...bookingDateFilter,
                ...rest,
                ...searchFilter 
            },
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
            orderBy: { bookingDate: 'desc' }
        })

        return bookings
    }

    async getBookingsByAccommodation(accommodationId: string) {
        const bookings = await this.prisma.booking.findMany({
            where: { 
                accommodationId: accommodationId,
                bookingDate: { gte: new Date() },
                status: { not: 'Cancelled' }
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
                }
            }
        })

        if(!booking) {
            throw new NotFoundException('Booking not found')
        }

        return booking
    }

    async getBookingsByUser(user: UserSession) {
        const bookings = await this.prisma.booking.findMany({
            where: { userId: user.id },
            include: {
                accommodation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        imageUrl: true
                    }
                }
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
}