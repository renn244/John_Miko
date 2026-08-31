import { Injectable } from '@nestjs/common';
import { AccommodationService } from 'src/accommodation/accommodation.service';
import { BookingService } from 'src/booking/booking.service';
import { MaintenanceService } from 'src/maintenance/maintenance.service';
import { PaymentService } from 'src/payment/payment.service';
import { FeedbackService } from 'src/feedback/feedback.service';
import { StaffReportsService } from 'src/staff-reports/staff-reports.service';
import {
  ReportExportPayload,
  ReportExportRow,
  ReportsExportService,
} from './reports-export.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly bookingService: BookingService,
    private readonly accommodationService: AccommodationService,
    private readonly maintenanceService: MaintenanceService,
    private readonly paymentService: PaymentService,
    private readonly feedbackService: FeedbackService,
    private readonly staffReportsService: StaffReportsService,
    private readonly reportsExportService: ReportsExportService,
  ) {}

  async getDailyMetrics(date?: Date) {
    const [bookingOverview, accommodationReport, maintenanceReport] = await Promise.all([
      this.bookingService.getBookingOverview(date),
      this.accommodationService.getAccommodationReports(date),
      this.maintenanceService.getMaintenanceReport(date),
    ]);

    return {
      bookings: bookingOverview.todayCount,
      occupancyRate: accommodationReport.occupancyRate,
      newTickets: maintenanceReport.newTickets,
      resolvedTickets: maintenanceReport.resolvedTickets,
    };
  }

  async getRevenueReport(date?: Date) {
    return this.paymentService.getPaymentReportBreakdown(date);
  }

  async getAccommodationReport(date?: Date) {
    return this.accommodationService.getAccommodationReports(date);
  }

  async getMaintenanceReport(date?: Date) {
    return this.maintenanceService.getMaintenanceReport(date);
  }

  async getFeedbackReport(date?: Date) {
    return this.feedbackService.getFeedbackReport(date);
  }

  async getStaffActivityReport(date?: Date) {
    return this.staffReportsService.ReportsReport(date);
  }

  async exportReport(date: Date | undefined, format: 'csv' | 'xlsx') {
    const payload = await this.getExportPayload(date);
    return format === 'xlsx'
      ? this.reportsExportService.createWorkbook(payload)
      : this.reportsExportService.createCsv(payload);
  }

  private async getExportPayload(date?: Date): Promise<ReportExportPayload> {
    const reportDate = (date ?? new Date()).toISOString().slice(0, 10);
    const [bookingOverview, accommodation, maintenance, revenue, feedback, staffActivity] =
      await Promise.all([
        this.bookingService.getBookingOverview(date),
        this.accommodationService.getAccommodationReports(date),
        this.maintenanceService.getMaintenanceReport(date),
        this.paymentService.getPaymentReportBreakdown(date),
        this.feedbackService.getFeedbackReport(date),
        this.staffReportsService.ReportsReport(date),
      ]);

    const revenueRows = [
      { label: 'Accommodation', value: revenue.accommodationFee },
      { label: 'Guest Fee', value: revenue.guestFee },
      { label: 'Pre-orders', value: revenue.preOrderFee },
      { label: 'Add-ons', value: revenue.addOnServiceFee },
      { label: 'Private Closure', value: revenue.privateClosureRevenue },
    ];
    const accommodationRows = [
      { label: 'Rooms', dimension: 'rooms', ...accommodation.room },
      { label: 'Cottages', dimension: 'cottages', ...accommodation.cottages },
      { label: 'Event Halls', dimension: 'event_halls', ...accommodation.eventHalls },
    ];

    const row = (
      section: string,
      metric: string,
      dimension: string,
      value: number,
      unit: string,
    ): ReportExportRow => ({
      report_date: reportDate,
      section,
      metric,
      dimension,
      value: Number(value) || 0,
      unit,
    });

    const rows: ReportExportRow[] = [
      row('daily_metrics', 'bookings', '', bookingOverview.todayCount, 'count'),
      row('daily_metrics', 'occupancy', '', accommodation.occupancyRate, 'percent'),
      row('daily_metrics', 'new_tickets', '', maintenance.newTickets, 'count'),
      row('daily_metrics', 'resolved_tickets', '', maintenance.resolvedTickets, 'count'),
      ...revenueRows.map((item) =>
        row('revenue', 'revenue', this.toSlug(item.label), item.value, 'PHP'),
      ),
      row('revenue', 'total_revenue', '', revenue.totalRevenue, 'PHP'),
      ...accommodationRows.flatMap((item) => [
        row('accommodation', 'occupied', item.dimension, item.occupied, 'count'),
        row('accommodation', 'available', item.dimension, item.free, 'count'),
        row('accommodation', 'capacity', item.dimension, item.total, 'count'),
      ]),
      row('accommodation', 'occupancy_rate', '', accommodation.occupancyRate, 'percent'),
      row('accommodation', 'total_capacity', '', accommodation.totalCapacity, 'count'),
      row('accommodation', 'available_capacity', '', accommodation.totalFree, 'count'),
      row('maintenance', 'new_tickets', '', maintenance.newTickets, 'count'),
      row('maintenance', 'resolved_tickets', '', maintenance.resolvedTickets, 'count'),
      row('staff_activity', 'check_in_reports', '', staffActivity.checkInReportToday, 'count'),
      row('staff_activity', 'check_out_reports', '', staffActivity.checkOutReportToday, 'count'),
      row('staff_activity', 'maintenance_reports', '', staffActivity.maintenanceReportToday, 'count'),
      row('feedback', 'feedback_count', '', feedback.receivedOnDate, 'count'),
      row('feedback', 'average_rating', '', feedback.averageOnDate, 'score_out_of_5'),
      ...feedback.distribution.map((item) =>
        row('feedback', 'rating_distribution', `${item.rating}_stars`, item.count, 'count'),
      ),
    ];

    return {
      reportDate,
      rows,
      summary: {
        bookings: bookingOverview.todayCount,
        occupancyRate: accommodation.occupancyRate,
        totalRevenue: revenue.totalRevenue,
        newTickets: maintenance.newTickets,
        resolvedTickets: maintenance.resolvedTickets,
        feedbackCount: feedback.receivedOnDate,
        averageRating: feedback.averageOnDate,
      },
      chartData: {
        revenue: revenueRows,
        accommodation: accommodationRows.map(({ label, occupied, free }) => ({
          label,
          occupied,
          free,
        })),
        feedback: [5, 4, 3, 2, 1].map((rating) => ({
          label: `${rating} star${rating === 1 ? '' : 's'}`,
          value: feedback.distribution.find((item) => item.rating === rating)?.count ?? 0,
        })),
      },
    };
  }

  private toSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  }
}
