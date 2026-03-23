import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async bookAccommodation(body: any, user: UserSession) {
        
        const accommodation = await this.prisma.accommodation.findUnique({ where: { id: body.accommodationId } })

        if(!accommodation) {
            throw new NotFoundException('Accommodation not found')
        }

        const booking = await this.prisma.$transaction(async (txprisma) => {
            const newBooking = await txprisma.booking.create({
                data: {
                    userId: user.id,
                    accommodationId: body.accommodationId,
                    bookingDate: new Date(body.bookingDate),
                    timeSlot: body.timeSlot
                }
            })

            await txprisma.bookedAccommodation.create({
                data: {
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

    async getBookings() {
        const currentDate = new Date()
        
        const bookings = await this.prisma.booking.findMany({
            where: { bookingDate: { gte: currentDate } },
            include: {
                accommodation: {
                    select: {
                        name: true,
                        type: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: { bookingDate: 'desc' }  
        })

        return bookings
    }

    async getBookingsByAccommodation(accommodationId: string) {
        const bookings = await this.prisma.booking.findMany({
            where: { accommodationId: accommodationId }
        })

        return bookings
    }

    async getBookingById(bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId }
        })

        return booking
    }

    async getBookingsByUser(user: UserSession) {
        const bookings = await this.prisma.booking.findMany({
            where: { userId: user.id }
        })

        return bookings 
    }
}