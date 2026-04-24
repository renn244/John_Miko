import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './dto/maintenance.dto';
import { MaintenanceService } from './maintenance.service';
import { GetMaintenanceDto } from './query/getMaintenance.dto';

@Controller('maintenance')
@UseGuards(AuthGuard)
export class MaintenanceController {
    constructor(
        private readonly maintenanceService: MaintenanceService
    ) {}

    @Post()
    async createMaintenance(@User() user: UserSession, @Body() body: CreateMaintenanceDto) {
        return this.maintenanceService.createMaintenance(user, body);
    }

    @Get()
    async getMaintenances(@Query() query: GetMaintenanceDto) {
        return this.maintenanceService.getMaintenances(query);
    }

    @Get('stats')
    async getMaintenanceStats() {
        return this.maintenanceService.getMaintenanceStats();
    }

    @Get(':id')
    async getMaintainanceById(@Param('id') id: string) {
        return this.maintenanceService.getMaintenanceById(id);
    }

    @Patch(':id')
    async updateMaintenance(@Param('id') id: string, @Body() body: UpdateMaintenanceDto) {
        return this.maintenanceService.updateMaintenance(id, body);
    }

    //  NO DELETION OF TICKETS, ONLY CLOSING, RESOLVED, PENDING PROCESSES
}
