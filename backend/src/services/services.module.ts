import { Module } from '@nestjs/common';
import { BookingServicesService } from './booking-services.service';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, BookingServicesService],
  exports: [BookingServicesService]
})
export class ServicesModule {}
