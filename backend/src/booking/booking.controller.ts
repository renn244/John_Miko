import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { Public } from 'src/lib/decorators/Public.decorator';
import { DateReportQueryDto } from 'src/lib/dto/date-report.query';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { BookingService } from './booking.service';
import { ChangeStatusDto, CreateBookingDto, CreateManualBookingDto, RescheduleBookingDto } from './dto/booking.dto';
import { GetBookingsByUserQuery, GetBookingsQuery, GetStaffBookingsQuery } from './query/getBookings.query';

@Controller('booking')
@UseGuards(AuthGuard, RolesGuard)
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
    ) {}

    // update or invalidate the cache when a new booking is made, 
    @Post()
    @Roles(Role.GUEST, Role.ADMIN)
    async bookAccommodation(@Body() body: CreateBookingDto, @User() user: UserSession) {
        return this.bookingService.bookAccommodation(body, user)
    }

    @Post('manual')
    @Roles(Role.ADMIN)
    async createManualBooking(@Body() body: CreateManualBookingDto, @User() user: UserSession) {
        return this.bookingService.createManualBooking(body, user);
    }
    
    @Get()
    @Roles(Role.ADMIN)
    async GetBookings(@Query() query: GetBookingsQuery) {
        return this.bookingService.getBookings(query)
    }

    @Get('overview')
    @Roles(Role.ADMIN)
    async getBookingOverview(@Query() query: DateReportQueryDto) {
        return this.bookingService.getBookingOverview(query.date);
    }

    @Get('staff')
    @Roles(Role.RESORT_STAFF)
    async getStaffBookings(@Query() query: GetStaffBookingsQuery) {
        return this.bookingService.getStaffBookings(query);
    }

    @Get('staff/:bookingId')
    @Roles(Role.RESORT_STAFF)
    async getStaffBookingById(@Param('bookingId') bookingId: string) {
        return this.bookingService.getStaffBookingById(bookingId);
    }

    // make a query where pagination base on date? just to  optimize the query 
    // and avoid fetching too many data at once
    @Public()
    @Get('byAccommodation/:accommodationId')
    async GetBookingsByAccommodation(@Param('accommodationId') accommodationId: string) {
        return this.bookingService.getBookingsByAccommodation(accommodationId)
    }
    
    @Get('closure')
    @Roles(Role.ADMIN)
    async GetBookingsForClosure(@Query() query: { accommodationId: string }) {
        return this.bookingService.getBookingsForClosure(query.accommodationId);
    }

    @Get('byBookingId/:bookingId')
    @Roles(Role.ADMIN, Role.GUEST)
    async GetBookingById(@Param('bookingId') bookingId: string, @User() user: UserSession) {
        return this.bookingService.getBookingById(bookingId, user)
    }

    @Get('byUser')
    @Roles(Role.GUEST, Role.ADMIN)
    async GetBookingsByUser(@User() user: UserSession, @Query() query: GetBookingsByUserQuery) {
        return this.bookingService.getBookingsByUser(user, query)
    }
    
    @Patch('reschedule/:bookingId')
    @Roles(Role.ADMIN)
    async RescheduleBooking(@Param('bookingId') bookingId: string, @Body() body: RescheduleBookingDto) {
        return this.bookingService.rescheduleBooking(bookingId, body)
    }

    @Patch('changeStatus/:bookingId')
    @Roles(Role.ADMIN)
    async changeStatus(@Param('bookingId') bookingId: string, @Body() body: ChangeStatusDto) {
        return this.bookingService.changeStatus(bookingId, body)
    }
}
