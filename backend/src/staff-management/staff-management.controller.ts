import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateStaffDto, UpdateStaffRole } from './dto/staff-management.dto';
import { getRestoreCandidateQueryDto } from './query/getRestoreCandidate.query';
import { getStaffsQueryDto } from './query/getStaffs.query';
import { StaffManagementService } from './staff-management.service';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { Roles } from 'src/lib/decorators/Roles.decorator';

@Controller('staff-management')
@UseGuards(AuthGuard, RolesGuard)
export class StaffManagementController {
    constructor(
        private readonly staffManagementService: StaffManagementService
    ) {}

    @Roles('ADMIN')
    @Post()
    async createStaff(@Body() body: CreateStaffDto) {
        return this.staffManagementService.createStaff(body)
    }

    @Roles('ADMIN')
    @Get()
    async getStaffs(@Query() query: getStaffsQueryDto) {
        return this.staffManagementService.getStaffs(query);
    }

    @Roles('ADMIN')
    @Get('restore-candidate')
    async getRestoreCandidate(@Query() query: getRestoreCandidateQueryDto) {
        return this.staffManagementService.getRestoreCandidate(query.email);
    }

    @Roles('ADMIN')
    @Get(':id')
    async getStaffById(@Param('id') id: string) {
        return this.staffManagementService.getStaffById(id);
    }

    @Roles('ADMIN')
    @Patch(':id/role')
    async updateStaffRole(@Param('id') id: string, @Body() body: UpdateStaffRole) {
        return this.staffManagementService.updateStaffRole(id, body);
    }

    @Roles('ADMIN')
    @Patch(':id/deactivate')
    async deactivateStaff(@Param('id') id: string) {
        return this.staffManagementService.deactivateStaff(id)
    }

    @Roles('ADMIN')
    @Patch(':id/reactivate')
    async reactivtedStaff(@Param('id') id: string) {
        return this.staffManagementService.reactivateStaff(id);
    }

    @Roles('ADMIN')
    @Patch(':id/delete')
    async deleteStaff(@Param('id') id: string) {
        return this.staffManagementService.deleteStaff(id);
    }

    @Roles('ADMIN')
    @Patch(':id/restore')
    async restoreStaff(@Param('id') id: string, @Body() body: CreateStaffDto) {
        return this.staffManagementService.restoreStaff(id, body);
    }
}
