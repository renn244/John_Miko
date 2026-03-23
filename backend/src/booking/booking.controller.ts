import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
    ) {}

    // update or invalidate the cache when a new booking is made, 
    @Post()
    async bookAccommodation(@Body() body: any, @User() user: UserSession) {
        return this.bookingService.bookAccommodation(body, user)
    }

    @Get()
    async GetBookings(@Query() query: { date?: string }) {
        return this.bookingService.getBookings()
    }

    @Get('byAccommodation/:accommodationId')
    async GetBookingsByAccommodation(@Param('accommodationId') accommodationId: string) {
        return this.bookingService.getBookingsByAccommodation(accommodationId)
    }

    @Get('byBookingId/:bookingId')
    async GetBookingById(@Param('bookingId') bookingId: string) {
        return this.bookingService.getBookingById(bookingId)
    }

    @Get('byUser')
    async GetBookingsByUser(@User() user: UserSession) {
        return this.bookingService.getBookingsByUser(user)
    }


    // ADD REQUESTS FOR UPDATING OR CANCELLING BOOKINGS LATER
    // make sure when updated, the cache if there is any should be invalidated and updated accordingly.

    // NO DELETE!
}
