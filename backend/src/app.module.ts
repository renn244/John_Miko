import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AuthSessionCacheModule } from './auth/auth-session-cache.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { AccommodationModule } from './accommodation/accommodation.module';
import { BookingModule } from './booking/booking.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PreOrderModule } from './pre-order/pre-order.module';
import { StaffReportsModule } from './staff-reports/staff-reports.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { StaffManagementModule } from './staff-management/staff-management.module';
import { GuestManagementModule } from './guest-management/guest-management.module';
import { ServicesModule } from './services/services.module';
import { ClosureModule } from './closure/closure.module';
import { MediaModule } from './media/media.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60_000,
          limit: 20,
        },
      ],
      errorMessage: 'Too many requests. Please try again later.',
    }),
    PrismaModule,
    AuthSessionCacheModule,
    AuthModule,
    UserModule,
    EmailModule,
    AccommodationModule,
    BookingModule,
    MenuItemModule,
    FeedbackModule,
    PreOrderModule,
    StaffReportsModule,
    MaintenanceModule,
    PaymentModule,
    PaymentMethodsModule,
    StaffManagementModule,
    GuestManagementModule,
    ServicesModule,
    ClosureModule,
    MediaModule,
    KnowledgeModule,
    ChatbotModule,
  ],
})
export class AppModule {}
