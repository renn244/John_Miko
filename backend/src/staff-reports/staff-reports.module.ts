import { Module } from '@nestjs/common';
import { StaffReportsController } from './staff-reports.controller';
import { StaffReportsService } from './staff-reports.service';

@Module({
  controllers: [StaffReportsController],
  providers: [StaffReportsService]
})
export class StaffReportsModule {}
