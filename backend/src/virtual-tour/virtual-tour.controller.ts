import { Controller, Get } from '@nestjs/common';
import { VirtualTourService } from './virtual-tour.service';

@Controller('virtual-tour')
export class VirtualTourController {
  constructor(private readonly virtualTourService: VirtualTourService) {}

  @Get()
  getPublicTour() {
    return this.virtualTourService.getPublicTour();
  }
}
