import { Injectable } from '@nestjs/common';
import { AccommodationService } from 'src/accommodation/accommodation.service';
import { BookingService } from 'src/booking/booking.service';
import { MaintenanceService } from 'src/maintenance/maintenance.service';
import { PaymentService } from 'src/payment/payment.service';
import { FeedbackService } from 'src/feedback/feedback.service';
import { StaffReportsService } from 'src/staff-reports/staff-reports.service';
import { ReportExportPayload, ReportExportRow } from './report-export.types';
import { ReportsCsvExportService } from './reports-csv-export.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly bookingService: BookingService,
    private readonly accommodationService: AccommodationService,
    private readonly maintenanceService: MaintenanceService,
    private readonly paymentService: PaymentService,
    private readonly feedbackService: FeedbackService,
    private readonly staffReportsService: StaffReportsService,
    private readonly reportsCsvExportService: ReportsCsvExportService,
  ) {}

  async getDailyMetrics(date?: Date) {
    const [bookingOverview, accommodationReport, maintenanceReport] =
      await Promise.all([
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

  async exportReport(date?: Date) {
    const payload = await this.getExportPayload(date);
    return this.reportsCsvExportService.create(payload);
  }

  private async getExportPayload(date?: Date): Promise<ReportExportPayload> {
    const reportDate = (date ?? new Date()).toISOString().slice(0, 10);
    const [
      bookingOverview,
      accommodation,
      maintenance,
      revenue,
      feedback,
      staffActivity,
    ] = await Promise.all([
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
      {
        label: 'Event Halls',
        dimension: 'event_halls',
        ...accommodation.eventHalls,
      },
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
      row(
        'daily_metrics',
        'stay_option_occupancy',
        '',
        accommodation.occupancyRate,
        'percent',
      ),
      row('daily_metrics', 'new_tickets', '', maintenance.newTickets, 'count'),
      row(
        'daily_metrics',
        'resolved_tickets',
        '',
        maintenance.resolvedTickets,
        'count',
      ),
      ...revenueRows.map((item) =>
        row('revenue', 'revenue', this.toSlug(item.label), item.value, 'PHP'),
      ),
      row('revenue', 'total_revenue', '', revenue.totalRevenue, 'PHP'),
      ...accommodationRows.flatMap((item) => [
        row(
          'accommodation',
          'booked_stays',
          item.dimension,
          item.booked,
          'count',
        ),
        row(
          'accommodation',
          'pending_holds',
          item.dimension,
          item.pending,
          'count',
        ),
        row(
          'accommodation',
          'available_slots',
          item.dimension,
          item.available,
          'count',
        ),
        row(
          'accommodation',
          'total_slots',
          item.dimension,
          item.totalSlots,
          'count',
        ),
        ...item.stayOptions.flatMap((stayOption) => [
          row(
            'accommodation_stay_option',
            'booked_stays',
            `${item.dimension}:${stayOption.label}`,
            stayOption.booked,
            'count',
          ),
          row(
            'accommodation_stay_option',
            'pending_holds',
            `${item.dimension}:${stayOption.label}`,
            stayOption.pending,
            'count',
          ),
          row(
            'accommodation_stay_option',
            'available_slots',
            `${item.dimension}:${stayOption.label}`,
            stayOption.available,
            'count',
          ),
          row(
            'accommodation_stay_option',
            'total_slots',
            `${item.dimension}:${stayOption.label}`,
            stayOption.totalSlots,
            'count',
          ),
        ]),
      ]),
      row(
        'accommodation',
        'stay_option_occupancy_rate',
        '',
        accommodation.occupancyRate,
        'percent',
      ),
      row(
        'accommodation',
        'total_slots',
        '',
        accommodation.totalSlots,
        'count',
      ),
      row(
        'accommodation',
        'pending_holds',
        '',
        accommodationRows.reduce((sum, item) => sum + item.pending, 0),
        'count',
      ),
      row(
        'accommodation',
        'available_slots',
        '',
        accommodation.totalAvailable,
        'count',
      ),
      row('maintenance', 'new_tickets', '', maintenance.newTickets, 'count'),
      row(
        'maintenance',
        'resolved_tickets',
        '',
        maintenance.resolvedTickets,
        'count',
      ),
      row(
        'staff_activity',
        'check_in_reports',
        '',
        staffActivity.checkInReportToday,
        'count',
      ),
      row(
        'staff_activity',
        'check_out_reports',
        '',
        staffActivity.checkOutReportToday,
        'count',
      ),
      row(
        'staff_activity',
        'maintenance_reports',
        '',
        staffActivity.maintenanceReportToday,
        'count',
      ),
      row('feedback', 'feedback_count', '', feedback.receivedOnDate, 'count'),
      row(
        'feedback',
        'average_rating',
        '',
        feedback.averageOnDate,
        'score_out_of_5',
      ),
      ...feedback.distribution.map((item) =>
        row(
          'feedback',
          'rating_distribution',
          `${item.rating}_stars`,
          item.count,
          'count',
        ),
      ),
    ];

    return {
      reportDate,
      rows,
    };
  }

  private toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }
}
