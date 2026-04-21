import { Module } from '@nestjs/common';
import { PreOrderController } from './pre-order.controller';
import { PreOrderService } from './pre-order.service';

@Module({
  controllers: [PreOrderController],
  providers: [PreOrderService],
  exports: [PreOrderService]
})
export class PreOrderModule {}
