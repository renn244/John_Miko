import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';

@Module({
  providers: [MaintenanceService],
  controllers: [MaintenanceController]
})
export class MaintenanceModule {}
