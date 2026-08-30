import * as ExcelJS from 'exceljs';
import { ReportExportPayload, ReportsExportService } from './reports-export.service';

describe('ReportsExportService', () => {
  const payload: ReportExportPayload = {
    reportDate: '2026-08-25',
    rows: [
      {
        report_date: '2026-08-25',
        section: 'daily_metrics',
        metric: 'bookings',
        dimension: '',
        value: 12,
        unit: 'count',
      },
      {
        report_date: '2026-08-25',
        section: 'daily_metrics',
        metric: 'occupancy',
        dimension: '',
        value: 75,
        unit: 'percent',
      },
      {
        report_date: '2026-08-25',
        section: 'revenue',
        metric: 'revenue',
        dimension: 'accommodation',
        value: 10200,
        unit: 'PHP',
      },
    ],
    summary: {
      bookings: 12,
      occupancyRate: 75,
      totalRevenue: 10200,
      newTickets: 3,
      resolvedTickets: 2,
      feedbackCount: 5,
      averageRating: 4.5,
    },
    chartData: {
      revenue: [{ label: 'Accommodation', value: 10200 }],
      accommodation: [{ label: 'Rooms', occupied: 6, free: 2 }],
      feedback: [{ label: '5 stars', value: 5 }],
    },
  };

  const service = new ReportsExportService();

  it('creates a UTF-8 CSV with the normalized report table', async () => {
    const result = await service.createCsv(payload);

    expect(result.fileName).toBe('john-mikos-place-report-2026-08-25.csv');
    expect(result.contentType).toBe('text/csv; charset=utf-8');
    expect(result.buffer.toString('utf8')).toContain(
      'report_date,section,metric,dimension,value,unit',
    );
    expect(result.buffer.toString('utf8')).toContain(
      '2026-08-25,revenue,revenue,accommodation,10200,PHP',
    );
  });

  it('creates an Excel workbook with a friendly summary and the complete data table', async () => {
    const result = await service.createWorkbook(payload);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(result.buffer as never);

    expect(result.fileName).toBe('john-mikos-place-report-2026-08-25.xlsx');
    expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
      'Report Data',
      'Summary',
    ]);
    expect(workbook.getWorksheet('Report Data')?.getCell('A1').value).toBe(
      'Report Date',
    );
    expect(workbook.getWorksheet('Summary')?.getCell('A1').value).toContain(
      'Daily Resort Report',
    );
  });
});
