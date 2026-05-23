import { Module } from '@nestjs/common';
import { PaymentModule } from 'src/payment/payment.module';
import { PreOrderModule } from 'src/pre-order/pre-order.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ServicesModule } from 'src/services/services.module';

@Module({
  providers: [BookingService],
  controllers: [BookingController],
  imports: [PreOrderModule, ServicesModule, PaymentModule]
})
export class BookingModule {}
