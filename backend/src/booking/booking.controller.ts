import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Public } from 'src/lib/decorators/Public.decorator';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';
import { GetBookingsQuery } from './query/getBookings.query';

@Controller('booking')
@UseGuards(AuthGuard)
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
    ) {}

    // update or invalidate the cache when a new booking is made, 
    @Post()
    async bookAccommodation(@Body() body: CreateBookingDto, @User() user: UserSession) {
        return this.bookingService.bookAccommodation(body, user)
    }

    @Get()
    async GetBookings(@Query() query: GetBookingsQuery) {
        return this.bookingService.getBookings(query)
    }

    @Public()
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
