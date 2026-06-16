import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { isBookingStayActive } from 'src/lib/utils/booking-stay.util';
import { getDateRange } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateReportDto,
  GetStaffReportsQuery,
  ReviewReportDto,
} from './dto/report.dto';

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
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      contactNo: true,
      role: true,
    },
  },
  reviewedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.ReportInclude;

@Injectable()
export class StaffReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReports(user: UserSession, body: CreateReportDto) {
    if (body.type !== 'maintenance' && !body.bookingId) {
      throw new BadRequestException(
        'A booking is required for check-in and check-out reports',
      );
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
            },
          },
        },
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.status !== 'Confirmed') {
        throw new BadRequestException(
          'Reports can only be linked to confirmed bookings',
        );
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
    });

    return report;
  }

  async viewReports(query: GetStaffReportsQuery) {
    return this.getPaginatedReports(query);
  }

  private async getPaginatedReports(
    query: GetStaffReportsQuery,
    userId?: string,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: Prisma.ReportWhereInput = {
      ...(userId ? { userId } : {}),
      ...(query.bookingId ? { bookingId: query.bookingId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.severity ? { severity: query.severity } : {}),
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: 'insensitive' } },
              { title: { contains: search, mode: 'insensitive' } },
              { bookingId: { contains: search, mode: 'insensitive' } },
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
              {
                user: { contactNo: { contains: search, mode: 'insensitive' } },
              },
            ],
          }
        : {}),
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

    const [
      totalToday,
      checkInReportToday,
      checkOutReportToday,
      total,
      pending,
      approved,
      rejected,
    ] = await Promise.all([
      this.prisma.report.count({ where: { createdAt: { gte, lte } } }),
      this.prisma.report.count({
        where: { createdAt: { gte, lte }, type: 'checkIn' },
      }),
      this.prisma.report.count({
        where: { createdAt: { gte, lte }, type: 'checkOut' },
      }),
      this.prisma.report.count(),
      this.prisma.report.count({ where: { status: 'Pending' } }),
      this.prisma.report.count({ where: { status: 'Approved' } }),
      this.prisma.report.count({ where: { status: 'Rejected' } }),
    ]);

    return {
      totalToday,
      checkInReportToday,
      checkOutReportToday,
      total,
      pending,
      approved,
      rejected,
    };
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

  async reviewReport(user: UserSession, id: string, body: ReviewReportDto) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status !== 'Pending') {
      throw new BadRequestException('Only pending reports can be reviewed');
    }

    if (body.status === 'Rejected' && !body.rejectionNote?.trim()) {
      throw new BadRequestException(
        'rejectionNote is required when rejecting a report',
      );
    }

    const updatedReport = await this.prisma.report.update({
      where: { id },
      data: {
        status: body.status,
        rejectionNote:
          body.status === 'Rejected'
            ? (body.rejectionNote?.trim() ?? null)
            : null,
        reviewedAt: new Date(),
        reviewedById: user.id,
      },
      include: reportInclude,
    });

    return updatedReport;
  }
}
