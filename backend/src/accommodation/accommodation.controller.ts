import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { Public } from 'src/lib/decorators/Public.decorator';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { AccommodationService } from './accommodation.service';
import { CreateAccommodationDto, UpdateAccommodationDto } from './dto/accommodation.dto';
import { GetAccommodationQueryDto } from './query/get-accommodations-query.dto';

@Controller('accommodation')
// should be optional auth guard
@UseGuards(AuthGuard, RolesGuard)
export class AccommodationController {
    constructor(
        private readonly accommodationService: AccommodationService
    ) {}

    @Roles(Role.ADMIN)
    @Post()
    async createAccommodation(@Body() body: CreateAccommodationDto) {
        return this.accommodationService.createAccommodation(body);
    }

    @Roles(Role.ADMIN)
    @Get('stats')
    async getAccommodationStats() {
        return this.accommodationService.getAccommodationStats();
    }

    @Public()
    @Get()
    async getAccommodations(@Query() query: GetAccommodationQueryDto) {
        return this.accommodationService.getAccommodations(query);
    }

    @Public()
    @Get('options')
    async getAccommodationOptions() {
        return this.accommodationService.getAccommodationOptions();
    }

    @Roles(Role.ADMIN)
    @Get('report')
    async getAccommodationReport() {
        return this.accommodationService.getAccommodationReports();
    }

    @Public()
    @Get(':id')
    async getAccommodationById(@Param('id') id: string) {
        return this.accommodationService.getAccommodationById(id);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    async updateAccommodation(@Param('id') id: string, @Body() body: UpdateAccommodationDto) {
        return this.accommodationService.updateAccommodation(id, body);
    }

    // should be archived actually
    @Roles(Role.ADMIN)
    @Delete(':id')
    async deleteAccommodation(@Param('id') id: string) {
        return this.accommodationService.deleteAccommodation(id);
    } 
}
