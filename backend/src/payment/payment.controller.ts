import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { RejectPaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
    ) {}

    // mainly just get data, because payment creation is gonna be used by other modules

    @Get('')
    @Roles(Role.ADMIN)
    async getPayments() {
        return this.paymentService.getPayments();
    }

    @Get('revenue-analytics')
    @Roles(Role.ADMIN)
    async getRevenueAnalytics() {
        return this.paymentService.getRevenueAnalytics();
    }

    @Get('report')
    @Roles(Role.ADMIN)
    async getPaymentReport() {
        return this.paymentService.getPaymentReportBreakdown();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    async getPaymentById(@Param('id') id: string) {
        return this.paymentService.getPaymentById(id);
    }

    @Patch(':id/approve')
    @Roles(Role.ADMIN)
    async approvePayment(@Param('id') id: string, @User() user: UserSession) {
        return this.paymentService.approvePayment(id, user.id);
    }

    @Patch(':id/reject')
    @Roles(Role.ADMIN)
    async rejectPayment(
        @Param('id') id: string,
        @Body() body: RejectPaymentDto,
        @User() user: UserSession
    ) {
        return this.paymentService.rejectPayment(id, body.rejectionNote, user.id);
    }
}
