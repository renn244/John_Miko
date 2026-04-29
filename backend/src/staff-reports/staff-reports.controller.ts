import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { StaffReportsService } from './staff-reports.service';

@Controller('staff-reports')
@UseGuards(AuthGuard)
export class StaffReportsController {
    constructor(
        private readonly staffReportsService: StaffReportsService,
    ) {}

    @Post()
    async createReport(@User() user: UserSession, @Body() body: any) {
        return this.staffReportsService.createReports(user, body);
    }

    @Get()
    async viewReports(@Query() query: any) {
        return this.staffReportsService.viewReports(query);
    }

    @Get('byUser')
    async viewReportByUserId(@User() user: UserSession, @Query() query: any) {
        return this.staffReportsService.viewReportsByUserId(user, query);
    }

    @Get(':id')
    async viewReportById(@User() user: UserSession, @Param('id') id: string) {
        return this.staffReportsService.viewReportById(user, id);
    }

}
