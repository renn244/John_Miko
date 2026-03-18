import { Module } from '@nestjs/common';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';

@Module({
  controllers: [AccommodationController],
  providers: [AccommodationService]
})
export class AccommodationModule {}
