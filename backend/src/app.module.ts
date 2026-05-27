import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { AccommodationModule } from './accommodation/accommodation.module';
import { BookingModule } from './booking/booking.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { FeedbackModule } from './feedback/feedback.module';
import { RulesModule } from './rules/rules.module';
import { PreOrderModule } from './pre-order/pre-order.module';
import { StaffReportsModule } from './staff-reports/staff-reports.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { PaymentModule } from './payment/payment.module';
import { StaffManagementModule } from './staff-management/staff-management.module';
import { GuestManagementModule } from './guest-management/guest-management.module';
import { ServicesModule } from './services/services.module';
import { ClosureModule } from './closure/closure.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    EmailModule,
    AccommodationModule,
    BookingModule,
    MenuItemModule,
    FeedbackModule,
    RulesModule,
    PreOrderModule,
    StaffReportsModule,
    MaintenanceModule,
    PaymentModule,
    StaffManagementModule,
    GuestManagementModule,
    ServicesModule,
    ClosureModule,
  ],
})
export class AppModule {}
