import { Controller } from '@nestjs/common';
import { PreOrderService } from './pre-order.service';

@Controller('pre-order')
export class PreOrderController {
    constructor(
        private readonly preOrderService: PreOrderService
    ) {}

}
