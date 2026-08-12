import { Module } from '@nestjs/common';
import { MaintenanceModule } from 'src/maintenance/maintenance.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { StaffReportsController } from './staff-reports.controller';
import { StaffReportsService } from './staff-reports.service';

@Module({
  imports: [MaintenanceModule, NotificationsModule],
  controllers: [StaffReportsController],
  providers: [StaffReportsService],
})
export class StaffReportsModule {}
