import { Module } from '@nestjs/common';
import { PaymentModule } from 'src/payment/payment.module';
import { PreOrderModule } from 'src/pre-order/pre-order.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  providers: [BookingService],
  controllers: [BookingController],
  imports: [PreOrderModule, PaymentModule]
})
export class BookingModule {}
