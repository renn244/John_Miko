import type { Response } from 'express';
import type { ReportsService } from './reports.service';

jest.mock('./reports.service', () => ({
  ReportsService: class ReportsService {},
}));

import { ReportsController } from './reports.controller';

describe('ReportsController', () => {
  it('sends an Excel export as raw binary instead of serializing its Buffer as JSON', async () => {
    const buffer = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
    const reportsService = {
      exportReport: jest.fn().mockResolvedValue({
        buffer,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileName: 'john-mikos-place-report-2026-09-13.xlsx',
      }),
    } as unknown as ReportsService;
    const response = {
      setHeader: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
    const controller = new ReportsController(reportsService);

    await controller.exportReport({ format: 'xlsx' }, response);

    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="john-mikos-place-report-2026-09-13.xlsx"',
    );
    expect(response.send).toHaveBeenCalledWith(buffer);
  });
});
