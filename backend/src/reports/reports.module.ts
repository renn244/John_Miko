import { Module } from '@nestjs/common';
import { AccommodationModule } from 'src/accommodation/accommodation.module';
import { BookingModule } from 'src/booking/booking.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { MaintenanceModule } from 'src/maintenance/maintenance.module';
import { PaymentModule } from 'src/payment/payment.module';
import { StaffReportsModule } from 'src/staff-reports/staff-reports.module';
import { ReportsController } from './reports.controller';
import { ReportsExportService } from './reports-export.service';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    BookingModule,
    AccommodationModule,
    MaintenanceModule,
    PaymentModule,
    FeedbackModule,
    StaffReportsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsExportService],
})
export class ReportsModule {}
