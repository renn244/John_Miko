import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { PreOrderService } from './pre-order.service';
import { GetAllPreOrdesQuery } from './query/get-all-preOrders.query';
import { PreOrderStatus } from 'src/generated/prisma/enums';

@Controller('pre-order')
@UseGuards(AuthGuard, RolesGuard)
export class PreOrderController {
    constructor(
        private readonly preOrderService: PreOrderService
    ) {}

    @Roles('KITCHEN_STAFF')
    @Get()
    async getPreOrders(@Query() query: GetAllPreOrdesQuery) {
        return this.preOrderService.getPreOrders(query);
    }

    @Roles('KITCHEN_STAFF')
    @Get(':bookingId')
    async getPreOrderDetailsByBookingId(@Param('bookingId') bookingId: string) {
        return this.preOrderService.getPreOrderDetailsByBookingId(bookingId);
    }

    @Roles('KITCHEN_STAFF')
    @Patch(':itemId/status')
    async updatePreOrderStatus(@Param('itemId') itemId: string, @Body('status') status: PreOrderStatus) {
        return this.preOrderService.updatePreOrderStatus(itemId, status);
    }

    @Roles('KITCHEN_STAFF')
    @Patch(':bookingId/status/complete-all')
    async completeAllPreOrdersByBookingId(@Param('bookingId') bookingId: string) {
        return this.preOrderService.completeAllPreOrdersByBookingId(bookingId);
    }
}
