import { Injectable } from '@nestjs/common';
import {
  DownloadableReport,
  ReportExportPayload,
  ReportExportRow,
} from './report-export.types';

@Injectable()
export class ReportsCsvExportService {
  create(payload: ReportExportPayload): DownloadableReport {
    const header = [
      'report_date',
      'section',
      'metric',
      'dimension',
      'value',
      'unit',
    ];
    const lines = [
      header.join(','),
      ...payload.rows.map((row) =>
        header
          .map((column) => this.toCsvCell(row[column as keyof ReportExportRow]))
          .join(','),
      ),
    ];

    return {
      buffer: Buffer.from(`\uFEFF${lines.join('\r\n')}\r\n`, 'utf8'),
      contentType: 'text/csv; charset=utf-8',
      fileName: `john-mikos-place-report-${payload.reportDate}.csv`,
    };
  }

  private toCsvCell(value: string | number) {
    const text = String(value);
    const safeText = /^[=+\-@\t\r\n]/.test(text) ? `\t${text}` : text;

    return /[",\r\n]/.test(safeText)
      ? `"${safeText.replace(/"/g, '""')}"`
      : safeText;
  }
}
