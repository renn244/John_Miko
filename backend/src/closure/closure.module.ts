import { Module } from '@nestjs/common';
import { ClosureService } from './closure.service';
import { ClosureController } from './closure.controller';

@Module({
  providers: [ClosureService],
  controllers: [ClosureController],
  exports: [ClosureService],
})
export class ClosureModule {}
