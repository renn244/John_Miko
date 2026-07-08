import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { MaintenanceExpertise } from 'src/generated/prisma/enums';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { isBookingStayActive } from 'src/lib/utils/booking-stay.util';
import { getDateRange, getSingleDayRange } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaintenanceService } from 'src/maintenance/maintenance.service';
import {
  CreateReportDto,
  GetStaffReportsQuery,
  ReviewReportDto,
} from './dto/report.dto';

const reportInclude = {
  booking: {
    select: {
      id: true,
      referenceCode: true,
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly maintenanceService: MaintenanceService,
  ) {}

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
              { booking: { referenceCode: { contains: search, mode: 'insensitive' } } },
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
              { user: { contactNo: { contains: search, mode: 'insensitive' } } },
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

  async ReportsReport(date?: Date) {
    const { gte, lte } = getSingleDayRange(date);

    const [
      totalToday,
      checkInReportToday,
      checkOutReportToday,
      maintenanceReportToday,
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
      this.prisma.report.count({
        where: { createdAt: { gte, lte }, type: 'maintenance' },
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
      maintenanceReportToday,
      total,
      pending,
      approved,
      rejected,
    };
  }

  async getOverview(date?: Date) {
    const { gte, lte } = getSingleDayRange(date);

    const [
      totalToday,
      checkInReportToday,
      checkOutReportToday,
      maintenanceReportToday,
      pendingReviewCount,
      pendingReports,
    ] = await Promise.all([
      this.prisma.report.count({ where: { createdAt: { gte, lte } } }),
      this.prisma.report.count({
        where: { createdAt: { gte, lte }, type: 'checkIn' },
      }),
      this.prisma.report.count({
        where: { createdAt: { gte, lte }, type: 'checkOut' },
      }),
      this.prisma.report.count({
        where: { createdAt: { gte, lte }, type: 'maintenance' },
      }),
      this.prisma.report.count({ where: { status: 'Pending' } }),
      this.prisma.report.findMany({
        where: { status: 'Pending' },
        include: reportInclude,
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      totalToday,
      checkInReportToday,
      checkOutReportToday,
      maintenanceReportToday,
      pendingReviewCount,
      pendingReports,
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
    if (body.status === 'Rejected' && !body.rejectionNote?.trim()) {
      throw new BadRequestException(
        'rejectionNote is required when rejecting a report',
      );
    }

    const updatedReport = await this.prisma.$transaction(async (tx) => {
      const report = await tx.report.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          title: true,
          description: true,
          proofImages: true,
          severity: true,
        },
      });

      if (!report) {
        throw new NotFoundException('Report not found');
      }

      if (report.status !== 'Pending') {
        throw new BadRequestException('Only pending reports can be reviewed');
      }

      const reviewResult = await tx.report.updateMany({
        where: {
          id,
          status: 'Pending',
        },
        data: {
          status: body.status,
          rejectionNote:
            body.status === 'Rejected'
              ? (body.rejectionNote?.trim() ?? null)
              : null,
          reviewedAt: new Date(),
          reviewedById: user.id,
        },
      });

      if (reviewResult.count === 0) {
        throw new BadRequestException('Only pending reports can be reviewed');
      }

      if (body.status === 'Approved') {
        await this.createMaintenanceFromReport(tx, report, body.expertise!);
      }

      return tx.report.findUnique({
        where: { id },
        include: reportInclude,
      });
    });

    if (!updatedReport) {
      throw new NotFoundException('Report not found');
    }

    return updatedReport;
  }

  private async createMaintenanceFromReport(
    tx: Prisma.TransactionClient,
    report: {
      id: string;
      title: string;
      description: string;
      proofImages: string[];
      severity: 'Low' | 'Medium' | 'High';
    },
    expertise: MaintenanceExpertise,
  ) {
    const assignedToId = await this.maintenanceService.selectAssignee(expertise);

    const maintenance = await tx.maintenance.create({
      data: {
        title: report.title,
        description: report.description,
        imagesUrl: report.proofImages,
        priority: report.severity,
        expertise,
        assignedToId,
      },
    });

    await tx.report.update({
      where: { id: report.id },
      data: {
        maintenanceId: maintenance.id,
      },
    });

    return maintenance;
  }
}
