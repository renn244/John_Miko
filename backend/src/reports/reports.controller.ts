import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { DateReportQueryDto } from 'src/lib/dto/date-report.query';
import { ReportsService } from './reports.service';
import { ExportReportQueryDto } from './dto/export-report.query';

@Controller('reports')
@UseGuards(AuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily-metrics')
  @Roles(Role.ADMIN)
  async getDailyMetrics(@Query() query: DateReportQueryDto) {
    return this.reportsService.getDailyMetrics(query.date);
  }

  @Get('revenue')
  @Roles(Role.ADMIN)
  async getRevenueReport(@Query() query: DateReportQueryDto) {
    return this.reportsService.getRevenueReport(query.date);
  }

  @Get('accommodation')
  @Roles(Role.ADMIN)
  async getAccommodationReport(@Query() query: DateReportQueryDto) {
    return this.reportsService.getAccommodationReport(query.date);
  }

  @Get('maintenance')
  @Roles(Role.ADMIN)
  async getMaintenanceReport(@Query() query: DateReportQueryDto) {
    return this.reportsService.getMaintenanceReport(query.date);
  }

  @Get('feedback')
  @Roles(Role.ADMIN)
  async getFeedbackReport(@Query() query: DateReportQueryDto) {
    return this.reportsService.getFeedbackReport(query.date);
  }

  @Get('staff-activity')
  @Roles(Role.ADMIN)
  async getStaffActivityReport(@Query() query: DateReportQueryDto) {
    return this.reportsService.getStaffActivityReport(query.date);
  }

  @Get('export')
  @Roles(Role.ADMIN)
  async exportReport(
    @Query() query: ExportReportQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const report = await this.reportsService.exportReport(query.date, query.format);
    response.setHeader('Content-Type', report.contentType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${report.fileName}"`,
    );
    response.setHeader('Cache-Control', 'no-store');
    return report.buffer;
  }
}
