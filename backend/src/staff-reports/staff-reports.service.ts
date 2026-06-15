import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { isBookingStayActive } from 'src/lib/utils/booking-stay.util';
import { getDateRange } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto, GetStaffReportsQuery } from './dto/report.dto';

const reportInclude = {
    booking: {
        select: {
            id: true,
            guestName: true,
            bookingDate: true,
            accommodation: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                }
            }
        }
    }
} satisfies Prisma.ReportInclude;

@Injectable()
export class StaffReportsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createReports(user: UserSession, body: CreateReportDto) {
        if (body.type !== 'maintenance' && !body.bookingId) {
            throw new BadRequestException('A booking is required for check-in and check-out reports');
        }

        if (body.bookingId) {
            const booking = await this.prisma.booking.findUnique({
                where: { id: body.bookingId },
                select: {
                    id: true,
                    status: true,
                    bookingDate: true,
                    stayOption: {
                        select: {
                            startTime: true,
                            endTime: true,
                        }
                    }
                }
            });

            if (!booking) {
                throw new NotFoundException('Booking not found');
            }

            if (booking.status !== 'Confirmed') {
                throw new BadRequestException('Reports can only be linked to confirmed bookings');
            }

            const reportingOpen = isBookingStayActive({
                bookingDate: booking.bookingDate,
                startTime: booking.stayOption.startTime,
                endTime: booking.stayOption.endTime,
            });

            if (!reportingOpen) {
                throw new BadRequestException(
                    'Booking-linked reports can only be submitted during the active stay',
                );
            }
        }

        const report = await this.prisma.report.create({
            data: {
                bookingId: body.bookingId,
                userId: user.id,
                title: body.title,
                description: body.description,
                proofImages: body.proofImages,
                type: body.type,
                severity: body.severity,
                status: 'Pending',
            },
            include: reportInclude,
        })

        return report;
    }

    async viewReports(query: GetStaffReportsQuery) {
        return this.getPaginatedReports(query);
    }

    private async getPaginatedReports(query: GetStaffReportsQuery, userId?: string) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where: Prisma.ReportWhereInput = {
            ...(userId ? { userId } : {}),
            ...(query.bookingId ? { bookingId: query.bookingId } : {}),
            ...(query.status ? { status: query.status } : {}),
            ...(query.type ? { type: query.type } : {}),
            ...(query.severity ? { severity: query.severity } : {}),
        };

        const [data, total] = await Promise.all([
            this.prisma.report.findMany({
                where,
                include: reportInclude,
                ...getPaginationArgs(page, limit),
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.report.count({ where }),
        ]);

        return {
            data,
            meta: getPaginationMeta(total, page, limit),
        };
    }

    async ReportsReport() {
        const { gte, lte } = getDateRange('day');
        
        const [totalToday, checkInReportToday, checkOutReportToday] = await Promise.all([
            this.prisma.report.count({ where: { createdAt: { gte, lte } } }),
            this.prisma.report.count({ where: { createdAt: { gte, lte }, type: 'checkIn' } }),
            this.prisma.report.count({ where: { createdAt: { gte, lte }, type: 'checkOut' } })
        ])

        return {
            totalToday, checkInReportToday, checkOutReportToday
        }
    }
 
    async viewReportsByUserId(user: UserSession, query: GetStaffReportsQuery) {
        return this.getPaginatedReports(query, user.id);
    }

    async viewReportById(user: UserSession, id: string) {
        const report = await this.prisma.report.findFirst({
            where: {
                id,
                ...(user.role === 'ADMIN' ? {} : { userId: user.id }),
            },
            include: reportInclude,
        });

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        return report;
    }
}
