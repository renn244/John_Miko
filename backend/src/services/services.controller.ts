import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Public } from 'src/lib/decorators/Public.decorator';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { CreateServiceDto, UpdateServiceAvailabilityDto } from './dto/services.dto';
import { GetAvailableServicesForBookingQueryDto } from './query/get-available-services-for-booking.dto';
import { GetServicesQueryDto } from './query/getServices.dto';
import { ServicesService } from './services.service';

@Controller('services')
@UseGuards(AuthGuard, RolesGuard)
export class ServicesController {
    constructor(
        private readonly servicesService: ServicesService
    ) {}

    @Roles("ADMIN")    
    @Post()
    async createService(@Body() body: CreateServiceDto) {
        return this.servicesService.createService(body)
    }

    @Roles("ADMIN")
    @Get()
    async getServices(@Query() query: GetServicesQueryDto){
        return this.servicesService.getServices(query);
    }

    @Get('available')
    async getServicesAvailableForBooking(@Query() query: GetAvailableServicesForBookingQueryDto) {
        return this.servicesService.getServicesAvailableForBooking(query)
    }

    @Roles("ADMIN")
    @Get('stats')
    async getServicesStats() {
        return this.servicesService.getServicesStats();
    }

    @Public()
    @Get(':serviceId')
    async getServiceById(@Param('serviceId') serviceId: string) {
        return this.servicesService.getServiceById(serviceId);       
    }

    @Roles("ADMIN")
    @Patch('availability/:serviceId')
    async updateServiceAvailability(
        @Param('serviceId') serviceId: string,
        @Body() body: UpdateServiceAvailabilityDto
    ) {
        return this.servicesService.updateServiceAvailability(serviceId, body.isActive);
    }

    @Roles("ADMIN")
    @Patch(':serviceId')
    async updateService(@Param('serviceId') serviceId: string, @Body() body: any) {
        return this.servicesService.updateService(serviceId, body);
    }

    @Roles("ADMIN")    
    @Delete(':serviceId')
    async deleteService(@Param('serviceId') serviceId: string) {
        return this.servicesService.deleteService(serviceId);
    }
}
