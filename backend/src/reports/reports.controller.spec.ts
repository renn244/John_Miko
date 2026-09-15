import type { Response } from 'express';
import type { ReportsService } from './reports.service';

jest.mock('./reports.service', () => ({
  ReportsService: class ReportsService {},
}));

import { ReportsController } from './reports.controller';

describe('ReportsController', () => {
  it('sends a CSV export as raw binary instead of serializing its Buffer as JSON', async () => {
    const buffer = Buffer.from('report_date,section');
    const reportsService = {
      exportReport: jest.fn().mockResolvedValue({
        buffer,
        contentType: 'text/csv; charset=utf-8',
        fileName: 'john-mikos-place-report-2026-09-13.csv',
      }),
    } as unknown as ReportsService;
    const response = {
      setHeader: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
    const controller = new ReportsController(reportsService);

    await controller.exportReport({}, response);

    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'text/csv; charset=utf-8',
    );
    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="john-mikos-place-report-2026-09-13.csv"',
    );
    expect(response.send).toHaveBeenCalledWith(buffer);
  });
});
