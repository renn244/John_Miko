import { Injectable, NotFoundException } from '@nestjs/common';
import { UserWhereInput } from 'src/generated/prisma/models';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetGuestsQueryDto } from './query/getGuests.query';

@Injectable()
export class GuestManagementService {
	constructor(
		private readonly prisma: PrismaService
	) {}

	private guestSelect = {
		id: true,
		email: true,
		name: true,
		contactNo: true,
		role: true,
		status: true,
		createdAt: true,
		_count: {
			select: {
				bookings: true,
			}
		}
	} as const;

	async getGuests(query: GetGuestsQueryDto) {
		const where: UserWhereInput = {
			role: 'GUEST',
			status: query.status,
			OR: query.search ? [
				{ name: { contains: query.search, mode: 'insensitive' as const } },
				{ id: { contains: query.search, mode: 'insensitive' as const } },
				{ email: { contains: query.search, mode: 'insensitive' as const } },
				{ contactNo: { contains: query.search, mode: 'insensitive' as const } },
			] : undefined,
		}

		const [data, total] = await Promise.all([
			this.prisma.user.findMany({
				where,
				select: this.guestSelect,
				...getPaginationArgs(query.page, query.limit),
				orderBy: { createdAt: 'desc' },
			}),
			this.prisma.user.count({ where })
		])

		const mapped = data.map((guest) => {
			const { _count, ...rest } = guest;
			return {
				...rest,
				bookingCount: _count.bookings,
			};
		})

		return {
			data: mapped,
			meta: getPaginationMeta(total, query.page, query.limit)
		}
	}

	async getGuestById(id: string) {
		const guest = await this.prisma.user.findFirst({
			where: {
				id,
				role: 'GUEST'
			},
			select: this.guestSelect,
		})

		if (!guest) {
			throw new NotFoundException('Guest User not Found!')
		}

		const { _count, ...rest } = guest;
		return {
			...rest,
			bookingCount: _count.bookings,
		};
	}

	async deactivateGuest(id: string) {
		await this.getGuestById(id);

		const updated = await this.prisma.user.update({
			where: { id },
			data: { status: 'INACTIVE' },
			select: this.guestSelect,
		})

		const { _count, ...rest } = updated;
		return {
			...rest,
			bookingCount: _count.bookings,
		};
	}

	async reactivateGuest(id: string) {
		await this.getGuestById(id);

		const updated = await this.prisma.user.update({
			where: { id },
			data: { status: 'ACTIVE' },
			select: this.guestSelect,
		})

		const { _count, ...rest } = updated;
		return {
			...rest,
			bookingCount: _count.bookings,
		};
	}
}
