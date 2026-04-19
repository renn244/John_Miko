import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Public } from 'src/lib/decorators/Public.decorator';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { BookingService } from './booking.service';
import { ChangeStatusDto, CreateBookingDto, RescheduleBookingDto } from './dto/booking.dto';
import { GetBookingsByUserQuery, GetBookingsQuery } from './query/getBookings.query';

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
    async GetBookingsByUser(@User() user: UserSession, @Query() query: GetBookingsByUserQuery) {
        return this.bookingService.getBookingsByUser(user, query)
    }
    
    @Patch('reschedule/:bookingId')
    async RescheduleBooking(@Param('bookingId') bookingId: string, @Body() body: RescheduleBookingDto) {
        return this.bookingService.rescheduleBooking(bookingId, body)
    }

    @Patch('changeStatus/:bookingId')
    async changeStatus(@Param('bookingId') bookingId: string, @Body() body: ChangeStatusDto) {
        return this.bookingService.changeStatus(bookingId, body)
    }

    // ADD REQUESTS FOR UPDATING OR CANCELLING BOOKINGS LATER
    // make sure when updated, the cache if there is any should be invalidated and updated accordingly.

    // NO DELETE!
}
