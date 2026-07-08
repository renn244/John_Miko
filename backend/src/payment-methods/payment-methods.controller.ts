import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { Public } from 'src/lib/decorators/Public.decorator';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { CreatePaymentMethodDto, UpdatePaymentMethodAvailabilityDto, UpdatePaymentMethodDto } from './dto/payment-methods.dto';
import { PaymentMethodsService } from './payment-methods.service';
import { GetPaymentMethodsQuery } from './query/get-payment-methods.query';

@Controller('payment-methods')
@UseGuards(AuthGuard)
export class PaymentMethodsController {
    constructor(
        private readonly paymentMethodsService: PaymentMethodsService
    ) {}

    @Public()
    @Get('active')
    async getActivePaymentMethods() {
        return this.paymentMethodsService.getActivePaymentMethods();
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    async createPaymentMethod(@Body() body: CreatePaymentMethodDto) {
        return this.paymentMethodsService.createPaymentMethod(body);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Get()
    async getPaymentMethods(@Query() query: GetPaymentMethodsQuery) {
        return this.paymentMethodsService.getPaymentMethods(query);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Get(':id')
    async getPaymentMethodById(@Param('id') id: string) {
        return this.paymentMethodsService.getPaymentMethodById(id);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Patch('availability/:id')
    async updatePaymentMethodAvailability(
        @Param('id') id: string,
        @Body() body: UpdatePaymentMethodAvailabilityDto
    ) {
        return this.paymentMethodsService.updatePaymentMethodAvailability(id, body.isActive);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Patch(':id')
    async updatePaymentMethod(@Param('id') id: string, @Body() body: UpdatePaymentMethodDto) {
        return this.paymentMethodsService.updatePaymentMethod(id, body);
    }

}
