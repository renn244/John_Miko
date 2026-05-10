import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { GuestManagementService } from './guest-management.service';
import { GetGuestsQueryDto } from './query/getGuests.query';

@Controller('guest-management')
@UseGuards(AuthGuard, RolesGuard)
export class GuestManagementController {
	constructor(
		private readonly guestManagementService: GuestManagementService
	) {}

	@Roles('ADMIN')
	@Get()
	async getGuests(@Query() query: GetGuestsQueryDto) {
		return this.guestManagementService.getGuests(query);
	}

	@Roles('ADMIN')
	@Get(':id')
	async getGuestById(@Param('id') id: string) {
		return this.guestManagementService.getGuestById(id);
	}

	@Roles('ADMIN')
	@Patch(':id/deactivate')
	async deactivateGuest(@Param('id') id: string) {
		return this.guestManagementService.deactivateGuest(id);
	}

	@Roles('ADMIN')
	@Patch(':id/reactivate')
	async reactivateGuest(@Param('id') id: string) {
		return this.guestManagementService.reactivateGuest(id);
	}
}
