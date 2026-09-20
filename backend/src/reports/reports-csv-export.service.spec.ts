import { ReportsCsvExportService } from './reports-csv-export.service';
import { ReportExportPayload } from './report-export.types';

describe('ReportsCsvExportService', () => {
  it('creates a UTF-8 CSV with the normalized report table', () => {
    const service = new ReportsCsvExportService();
    const payload: ReportExportPayload = {
      reportDate: '2026-08-25',
      rows: [
        {
          report_date: '2026-08-25',
          section: 'revenue',
          metric: 'revenue',
          dimension: 'accommodation',
          value: 10200,
          unit: 'PHP',
        },
      ],
    };
    const result = service.create(payload);

    expect(result.fileName).toBe('john-mikos-place-report-2026-08-25.csv');
    expect(result.contentType).toBe('text/csv; charset=utf-8');
    expect(result.buffer.toString('utf8')).toContain(
      'report_date,section,metric,dimension,value,unit',
    );
    expect(result.buffer.toString('utf8')).toContain(
      '2026-08-25,revenue,revenue,accommodation,10200,PHP',
    );
  });
});
