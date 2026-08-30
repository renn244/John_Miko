import { Module } from '@nestjs/common';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';

@Module({
  controllers: [AccommodationController],
  providers: [AccommodationService],
  exports: [AccommodationService],
})
export class AccommodationModule {}
