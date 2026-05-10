import { Module } from '@nestjs/common';
import { StaffManagementService } from './staff-management.service';
import { StaffManagementController } from './staff-management.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [StaffManagementService],
  controllers: [StaffManagementController],
  imports: [EmailModule]
})
export class StaffManagementModule {}
