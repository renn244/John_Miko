import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { DateReportQueryDto } from 'src/lib/dto/date-report.query';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { CompleteMaintenanceDto, CreateMaintenanceDto, UpdateMaintenanceDto } from './dto/maintenance.dto';
import { MaintenanceService } from './maintenance.service';
import { GetMaintenanceDto } from './query/getMaintenance.dto';

@Controller('maintenance')
@UseGuards(AuthGuard, RolesGuard)
export class MaintenanceController {
    constructor(
        private readonly maintenanceService: MaintenanceService
    ) {}

    @Post()
    @Roles(Role.ADMIN)
    async createMaintenance(@User() user: UserSession, @Body() body: CreateMaintenanceDto) {
        return this.maintenanceService.createMaintenance(user, body);
    }

    @Get()
    @Roles(Role.ADMIN)
    async getMaintenances(@Query() query: GetMaintenanceDto) {
        return this.maintenanceService.getMaintenances(query);
    }

    @Get('stats')
    @Roles(Role.ADMIN)
    async getMaintenanceStats() {
        return this.maintenanceService.getMaintenanceStats();
    }

    @Get('overview')
    @Roles(Role.ADMIN)
    async getMaintenanceOverview(@Query() query: DateReportQueryDto) {
        return this.maintenanceService.getMaintenanceOverview(query.date);
    }

    @Get('assigned/active')
    @Roles(Role.MAINTENANCE_STAFF)
    async getAssignedActiveMaintenances(@User() user: UserSession, @Query() query: GetMaintenanceDto) {
        return this.maintenanceService.getAssignedActiveMaintenances(user, query);
    }

    @Get('assigned/summary')
    @Roles(Role.MAINTENANCE_STAFF)
    async getAssignedMaintenanceSummary(@User() user: UserSession, @Query() query: GetMaintenanceDto) {
        return this.maintenanceService.getAssignedMaintenanceSummary(user, query);
    }

    @Get('assigned/history')
    @Roles(Role.MAINTENANCE_STAFF)
    async getAssignedMaintenanceHistory(@User() user: UserSession, @Query() query: GetMaintenanceDto) {
        return this.maintenanceService.getAssignedMaintenanceHistory(user, query);
    }

    @Get('assigned/:id')
    @Roles(Role.MAINTENANCE_STAFF)
    async getAssignedMaintainanceById(@User() user: UserSession, @Param('id') id: string) {
        return this.maintenanceService.getAssignedMaintenanceById(user, id);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    async getMaintainanceById(@Param('id') id: string) {
        return this.maintenanceService.getMaintenanceById(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    async updateMaintenance(@Param('id') id: string, @Body() body: UpdateMaintenanceDto) {
        return this.maintenanceService.updateMaintenance(id, body);
    }

    @Patch(':id/start')
    @Roles(Role.ADMIN, Role.MAINTENANCE_STAFF)
    async startMaintenance(@User() user: UserSession, @Param('id') id: string) {
        return this.maintenanceService.startMaintenance(user, id);
    }

    @Patch(':id/complete')
    @Roles(Role.ADMIN, Role.MAINTENANCE_STAFF)
    async completeMaintenance(@User() user: UserSession, @Param('id') id: string, @Body() body: CompleteMaintenanceDto) {
        return this.maintenanceService.completeMaintenance(user, id, body);
    }

    @Patch(':id/reopen')
    @Roles(Role.ADMIN, Role.MAINTENANCE_STAFF)
    async reopenMaintenance(@User() user: UserSession, @Param('id') id: string) {
        return this.maintenanceService.reopenMaintenance(user, id);
    }
}
