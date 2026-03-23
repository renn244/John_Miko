import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}
