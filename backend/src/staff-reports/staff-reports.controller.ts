import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { DateReportQueryDto } from 'src/lib/dto/date-report.query';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import {
  CreateReportDto,
  GetStaffReportsQuery,
  ReviewReportDto,
} from './dto/report.dto';
import { StaffReportsService } from './staff-reports.service';

@Controller('staff-reports')
@UseGuards(AuthGuard, RolesGuard)
export class StaffReportsController {
  constructor(private readonly staffReportsService: StaffReportsService) {}

  @Post()
  @Roles(Role.RESORT_STAFF)
  async createReport(@User() user: UserSession, @Body() body: CreateReportDto) {
    return this.staffReportsService.createReports(user, body);
  }

  @Get()
  @Roles(Role.ADMIN)
  async viewReports(@Query() query: GetStaffReportsQuery) {
    return this.staffReportsService.viewReports(query);
  }

  @Get('report')
  @Roles(Role.ADMIN)
  async getReportsReport(@Query() query: DateReportQueryDto) {
    return this.staffReportsService.ReportsReport(query.date);
  }

  @Get('overview')
  @Roles(Role.ADMIN)
  async getOverview(@Query() query: DateReportQueryDto) {
    return this.staffReportsService.getOverview(query.date);
  }

  @Get('byUser')
  @Roles(Role.RESORT_STAFF)
  async viewReportByUserId(
    @User() user: UserSession,
    @Query() query: GetStaffReportsQuery,
  ) {
    return this.staffReportsService.viewReportsByUserId(user, query);
  }

  @Get(':id')
  @Roles(Role.RESORT_STAFF, Role.ADMIN)
  async viewReportById(@User() user: UserSession, @Param('id') id: string) {
    return this.staffReportsService.viewReportById(user, id);
  }

  @Patch(':id/review')
  @Roles(Role.ADMIN)
  async reviewReport(
    @User() user: UserSession,
    @Param('id') id: string,
    @Body() body: ReviewReportDto,
  ) {
    return this.staffReportsService.reviewReport(user, id, body);
  }
}
