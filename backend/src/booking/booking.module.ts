import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { PaymentModule } from 'src/payment/payment.module';
import { PreOrderModule } from 'src/pre-order/pre-order.module';
import { BookingController } from './booking.controller';
import { BookingEmailService } from './booking-email.service';
import { BookingService } from './booking.service';
import { ServicesModule } from 'src/services/services.module';
import { ClosureModule } from 'src/closure/closure.module';

@Module({
  providers: [BookingService, BookingEmailService],
  controllers: [BookingController],
  imports: [PreOrderModule, ServicesModule, PaymentModule, ClosureModule, EmailModule]
})
export class BookingModule {}
