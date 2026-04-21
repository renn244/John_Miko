import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PreOrderModule } from 'src/pre-order/pre-order.module';

@Module({
  providers: [BookingService],
  controllers: [BookingController],
  imports: [PreOrderModule]
})
export class BookingModule {}
