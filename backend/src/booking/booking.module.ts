import { Module } from '@nestjs/common';
import { PaymentModule } from 'src/payment/payment.module';
import { PreOrderModule } from 'src/pre-order/pre-order.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ServicesModule } from 'src/services/services.module';
import { ClosureModule } from 'src/closure/closure.module';

@Module({
  providers: [BookingService],
  controllers: [BookingController],
  imports: [PreOrderModule, ServicesModule, PaymentModule, ClosureModule]
})
export class BookingModule {}
