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
    FeedbackModule
  ],
})
export class AppModule {}
