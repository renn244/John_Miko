import { Controller, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
    ) {}

    // mainly just get data, because payment creation is gonna be used by other modules

    @Get('')
    async getPayments() {
        return this.paymentService.getPayments();
    }

    @Get(':id')
    async getPaymentById(@Param('id') id: string) {
        return this.paymentService.getPaymentById(id);
    }
}
