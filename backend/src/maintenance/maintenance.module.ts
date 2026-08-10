import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  providers: [MaintenanceService],
  controllers: [MaintenanceController],
  exports: [MaintenanceService],
  imports: [NotificationsModule],
})
export class MaintenanceModule {}
