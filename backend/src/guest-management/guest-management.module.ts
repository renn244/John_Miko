import { Module } from '@nestjs/common';
import { GuestManagementService } from './guest-management.service';
import { GuestManagementController } from './guest-management.controller';

@Module({
  providers: [GuestManagementService],
  controllers: [GuestManagementController]
})
export class GuestManagementModule {}
