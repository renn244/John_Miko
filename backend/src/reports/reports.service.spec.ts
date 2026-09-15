import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  const bookingService = {
    getBookingOverview: jest.fn(),
  };
  const accommodationService = {
    getAccommodationReports: jest.fn(),
  };
  const maintenanceService = {
    getMaintenanceReport: jest.fn(),
  };
  const paymentService = {
    getPaymentReportBreakdown: jest.fn(),
  };
  const feedbackService = {
    getFeedbackReport: jest.fn(),
  };
  const staffReportsService = {
    ReportsReport: jest.fn(),
  };
  const reportsCsvExportService = {
    create: jest.fn(),
  };

  let service: ReportsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReportsService(
      bookingService as any,
      accommodationService as any,
      maintenanceService as any,
      paymentService as any,
      feedbackService as any,
      staffReportsService as any,
      reportsCsvExportService as any,
    );
  });

  it('combines selected-date operational metrics into one response', async () => {
    const date = new Date('2026-08-29T00:00:00.000Z');
    bookingService.getBookingOverview.mockResolvedValue({ todayCount: 12 });
    accommodationService.getAccommodationReports.mockResolvedValue({
      occupancyRate: 68,
    });
    maintenanceService.getMaintenanceReport.mockResolvedValue({
      newTickets: 4,
      resolvedTickets: 3,
    });

    await expect(service.getDailyMetrics(date)).resolves.toEqual({
      bookings: 12,
      occupancyRate: 68,
      newTickets: 4,
      resolvedTickets: 3,
    });
    expect(bookingService.getBookingOverview).toHaveBeenCalledWith(date);
    expect(accommodationService.getAccommodationReports).toHaveBeenCalledWith(
      date,
    );
    expect(maintenanceService.getMaintenanceReport).toHaveBeenCalledWith(date);
  });

  it('delegates each detailed report to its domain service', async () => {
    const date = new Date('2026-08-29T00:00:00.000Z');
    paymentService.getPaymentReportBreakdown.mockResolvedValue({
      totalRevenue: 1528,
    });
    accommodationService.getAccommodationReports.mockResolvedValue({
      occupancyRate: 68,
    });
    maintenanceService.getMaintenanceReport.mockResolvedValue({
      newTickets: 4,
    });
    feedbackService.getFeedbackReport.mockResolvedValue({ averageOnDate: 4.7 });
    staffReportsService.ReportsReport.mockResolvedValue({ totalToday: 12 });

    await expect(service.getRevenueReport(date)).resolves.toEqual({
      totalRevenue: 1528,
    });
    await expect(service.getAccommodationReport(date)).resolves.toEqual({
      occupancyRate: 68,
    });
    await expect(service.getMaintenanceReport(date)).resolves.toEqual({
      newTickets: 4,
    });
    await expect(service.getFeedbackReport(date)).resolves.toEqual({
      averageOnDate: 4.7,
    });
    await expect(service.getStaffActivityReport(date)).resolves.toEqual({
      totalToday: 12,
    });
  });
});
