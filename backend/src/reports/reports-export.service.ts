import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

type SharpFactory = (input: Buffer) => {
  png: () => { toBuffer: () => Promise<Buffer> };
};

const sharp = require('sharp') as SharpFactory;

export type ReportExportRow = {
  report_date: string;
  section: string;
  metric: string;
  dimension: string;
  value: number;
  unit: string;
};

export type ReportExportPayload = {
  reportDate: string;
  rows: ReportExportRow[];
  summary: {
    bookings: number;
    occupancyRate: number;
    totalRevenue: number;
    newTickets: number;
    resolvedTickets: number;
    feedbackCount: number;
    averageRating: number;
  };
  chartData: {
    revenue: Array<{ label: string; value: number }>;
    accommodation: Array<{ label: string; occupied: number; free: number }>;
    feedback: Array<{ label: string; value: number }>;
  };
};

type DownloadableReport = {
  buffer: Buffer;
  contentType: string;
  fileName: string;
};

const BRAND_BLUE = '1E73BE';
const BRAND_BLUE_DARK = '174E82';
const MUTED_BLUE = 'EAF3FF';
const BORDER = 'D7E2F0';
const TEXT = '172033';
const MUTED_TEXT = '62708A';

@Injectable()
export class ReportsExportService {
  async createCsv(payload: ReportExportPayload): Promise<DownloadableReport> {
    const header = ['report_date', 'section', 'metric', 'dimension', 'value', 'unit'];
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

  async createWorkbook(payload: ReportExportPayload): Promise<DownloadableReport> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "John Miko's Place";
    workbook.created = new Date();
    workbook.modified = new Date();

    const dataSheet = workbook.addWorksheet('Report Data', {
      views: [{ state: 'frozen', ySplit: 1, showGridLines: false }],
    });
    this.buildDataSheet(dataSheet, payload.rows);

    const summarySheet = workbook.addWorksheet('Summary', {
      views: [{ showGridLines: false }],
    });
    await this.buildSummarySheet(summarySheet, payload);

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    return {
      buffer,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileName: `john-mikos-place-report-${payload.reportDate}.xlsx`,
    };
  }

  private buildDataSheet(sheet: ExcelJS.Worksheet, rows: ReportExportRow[]) {
    const columns = [
      { name: 'Report Date', filterButton: true },
      { name: 'Section', filterButton: true },
      { name: 'Metric', filterButton: true },
      { name: 'Dimension', filterButton: true },
      { name: 'Value', filterButton: true },
      { name: 'Unit', filterButton: true },
    ];

    sheet.addTable({
      name: 'ReportData',
      ref: 'A1',
      headerRow: true,
      style: {
        theme: 'TableStyleMedium2',
        showRowStripes: true,
      },
      columns,
      rows: rows.map((row) => [
        row.report_date,
        row.section,
        row.metric,
        row.dimension,
        row.value,
        row.unit,
      ]),
    });

    sheet.getColumn(1).width = 15;
    sheet.getColumn(2).width = 20;
    sheet.getColumn(3).width = 24;
    sheet.getColumn(4).width = 22;
    sheet.getColumn(5).width = 16;
    sheet.getColumn(6).width = 18;
    sheet.getColumn(5).numFmt = '#,##0.##';
    sheet.eachRow((row) => {
      row.alignment = { vertical: 'middle' };
    });
  }

  private async buildSummarySheet(
    sheet: ExcelJS.Worksheet,
    payload: ReportExportPayload,
  ) {
    sheet.properties.defaultRowHeight = 19;
    [22, 16, 4, 22, 16, 4, 22, 16, 4, 22, 16, 4].forEach((width, index) => {
      sheet.getColumn(index + 1).width = width;
    });

    sheet.mergeCells('A1:L1');
    const brandCell = sheet.getCell('A1');
    brandCell.value = "John Miko's Place  |  Daily Resort Report";
    brandCell.font = { name: 'Aptos Display', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    brandCell.alignment = { vertical: 'middle' };
    brandCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BRAND_BLUE_DARK}` } };
    sheet.getRow(1).height = 30;

    sheet.mergeCells('A2:L2');
    const subtitle = sheet.getCell('A2');
    subtitle.value = `Selected date: ${this.toDisplayDate(payload.reportDate)}  •  Generated from the live report data`;
    subtitle.font = { name: 'Aptos', size: 10, color: { argb: `FF${MUTED_TEXT}` } };
    subtitle.alignment = { vertical: 'middle' };
    sheet.getRow(2).height = 22;

    const lastRow = payload.rows.length + 1;
    this.addSectionTitle(sheet, 'A4:E4', 'Daily snapshot');
    this.addSectionTitle(sheet, 'G4:K4', 'Operational context');
    this.addMetricPair(sheet, 'A5', 'B5', 'Bookings', { formula: this.sumIfFormula(lastRow, 'daily_metrics', 'bookings'), result: payload.summary.bookings }, '#,##0');
    this.addMetricPair(sheet, 'D5', 'E5', 'Occupancy', { formula: `(${this.sumIfFormula(lastRow, 'daily_metrics', 'occupancy')})/100`, result: payload.summary.occupancyRate / 100 }, '0%');
    this.addMetricPair(sheet, 'A6', 'B6', 'Total revenue', { formula: this.sumIfFormula(lastRow, 'revenue', 'revenue'), result: payload.summary.totalRevenue }, '"PHP" #,##0');
    this.addMetricPair(sheet, 'D6', 'E6', 'New tickets', { formula: this.sumIfFormula(lastRow, 'daily_metrics', 'new_tickets'), result: payload.summary.newTickets }, '#,##0');
    this.addMetricPair(sheet, 'A7', 'B7', 'Resolved tickets', { formula: this.sumIfFormula(lastRow, 'daily_metrics', 'resolved_tickets'), result: payload.summary.resolvedTickets }, '#,##0');
    this.addMetricPair(sheet, 'D7', 'E7', 'Average rating', { formula: this.sumIfFormula(lastRow, 'feedback', 'average_rating'), result: payload.summary.averageRating }, '0.0" / 5"');
    this.addMetricPair(sheet, 'G5', 'H5', 'Feedback received', payload.summary.feedbackCount, '#,##0');
    this.addMetricPair(sheet, 'J5', 'K5', 'Total capacity', this.getMetric(payload.rows, 'accommodation', 'total_capacity'), '#,##0');
    this.addMetricPair(sheet, 'G6', 'H6', 'Available capacity', this.getMetric(payload.rows, 'accommodation', 'available_capacity'), '#,##0');
    this.addMetricPair(sheet, 'J6', 'K6', 'Check-in reports', this.getMetric(payload.rows, 'staff_activity', 'check_in_reports'), '#,##0');
    this.addMetricPair(sheet, 'G7', 'H7', 'Check-out reports', this.getMetric(payload.rows, 'staff_activity', 'check_out_reports'), '#,##0');
    this.addMetricPair(sheet, 'J7', 'K7', 'Maintenance reports', this.getMetric(payload.rows, 'staff_activity', 'maintenance_reports'), '#,##0');

    const [revenueChart, accommodationChart, feedbackChart] = await Promise.all([
      this.createBarChart('Revenue by source (PHP)', payload.chartData.revenue, '#1E73BE', 'PHP'),
      this.createStackedAccommodationChart(payload.chartData.accommodation),
      this.createBarChart('Guest feedback by rating', payload.chartData.feedback, '#D97706', 'responses'),
    ]);

    this.addFallbackTable(sheet, 'A10:F23', 'Revenue breakdown', ['Source', 'Amount'], payload.chartData.revenue.map((item) => [item.label, item.value]), '"PHP" #,##0');
    this.addFallbackTable(sheet, 'G10:L23', 'Accommodation capacity', ['Type', 'Occupied', 'Available'], payload.chartData.accommodation.map((item) => [item.label, item.occupied, item.free]), '#,##0');
    this.addFallbackTable(sheet, 'A25:F38', 'Guest feedback', ['Rating', 'Responses'], payload.chartData.feedback.map((item) => [item.label, item.value]), '#,##0');
    this.addFallbackTable(sheet, 'G25:L38', 'Maintenance & staff activity', ['Measure', 'Count'], [
      ['New maintenance tickets', payload.summary.newTickets],
      ['Resolved maintenance tickets', payload.summary.resolvedTickets],
      ['Check-in reports', this.getMetric(payload.rows, 'staff_activity', 'check_in_reports')],
      ['Check-out reports', this.getMetric(payload.rows, 'staff_activity', 'check_out_reports')],
      ['Maintenance reports', this.getMetric(payload.rows, 'staff_activity', 'maintenance_reports')],
    ], '#,##0');

    sheet.addImage(workbookImage(sheet, revenueChart), 'A10:F23');
    sheet.addImage(workbookImage(sheet, accommodationChart), 'G10:L23');
    sheet.addImage(workbookImage(sheet, feedbackChart), 'A25:F38');
  }

  private addSectionTitle(sheet: ExcelJS.Worksheet, range: string, title: string) {
    sheet.mergeCells(range);
    const cell = sheet.getCell(range.split(':')[0]);
    cell.value = title;
    cell.font = { name: 'Aptos Display', size: 11, bold: true, color: { argb: `FF${TEXT}` } };
    cell.alignment = { vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F7FB' } };
    cell.border = { bottom: { style: 'medium', color: { argb: `FF${BRAND_BLUE}` } } };
  }

  private addMetricPair(
    sheet: ExcelJS.Worksheet,
    labelCellReference: string,
    valueCellReference: string,
    label: string,
    value: number | ExcelJS.CellFormulaValue,
    numberFormat: string,
  ) {
    const labelCell = sheet.getCell(labelCellReference);
    labelCell.value = label;
    labelCell.font = { name: 'Aptos', size: 10, color: { argb: `FF${MUTED_TEXT}` } };
    labelCell.border = { bottom: { style: 'thin', color: { argb: `FF${BORDER}` } } };

    const valueCell = sheet.getCell(valueCellReference);
    valueCell.value = value;
    valueCell.numFmt = numberFormat;
    valueCell.alignment = { horizontal: 'right' };
    valueCell.font = { name: 'Aptos Display', size: 11, bold: true, color: { argb: `FF${TEXT}` } };
    valueCell.border = { bottom: { style: 'thin', color: { argb: `FF${BORDER}` } } };
  }

  private addFallbackTable(
    sheet: ExcelJS.Worksheet,
    range: string,
    title: string,
    headers: string[],
    rows: Array<Array<string | number>>,
    valueNumberFormat: string,
  ) {
    const [start, end] = range.split(':');
    const startRow = Number(start.match(/\d+/)?.[0]);
    const startColumn = this.toColumnNumber(start.replace(/\d+/g, ''));
    const endColumn = this.toColumnNumber(end.replace(/\d+/g, ''));
    const span = endColumn - startColumn + 1;
    const columnStep = Math.max(1, Math.floor(span / headers.length));

    sheet.mergeCells(
      `${this.toColumnLetter(startColumn)}${startRow}:${this.toColumnLetter(endColumn)}${startRow}`,
    );
    const titleCell = sheet.getRow(startRow).getCell(startColumn);
    titleCell.value = title;
    titleCell.font = { name: 'Aptos Display', size: 12, bold: true, color: { argb: `FF${TEXT}` } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F7FB' } };

    const headerRow = sheet.getRow(startRow + 1);
    headers.forEach((header, index) => {
      const columnStart = startColumn + index * columnStep;
      const columnEnd = Math.min(endColumn, columnStart + columnStep - 1);
      sheet.mergeCells(
        `${this.toColumnLetter(columnStart)}${startRow + 1}:${this.toColumnLetter(columnEnd)}${startRow + 1}`,
      );
      const cell = headerRow.getCell(columnStart);
      cell.value = header;
      cell.font = { name: 'Aptos', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BRAND_BLUE}` } };
    });

    rows.forEach((values, rowIndex) => {
      const worksheetRow = sheet.getRow(startRow + 2 + rowIndex);
      values.forEach((value, valueIndex) => {
        const columnStart = startColumn + valueIndex * columnStep;
        const columnEnd = Math.min(endColumn, columnStart + columnStep - 1);
        sheet.mergeCells(
          `${this.toColumnLetter(columnStart)}${startRow + 2 + rowIndex}:${this.toColumnLetter(columnEnd)}${startRow + 2 + rowIndex}`,
        );
        const cell = worksheetRow.getCell(columnStart);
        cell.value = value;
        cell.font = { name: 'Aptos', size: 10, color: { argb: `FF${TEXT}` } };
        cell.alignment = { horizontal: typeof value === 'number' ? 'right' : 'left' };
        if (typeof value === 'number') cell.numFmt = valueNumberFormat;
        cell.border = { bottom: { style: 'thin', color: { argb: `FF${BORDER}` } } };
      });
    });
  }

  private sumIfFormula(lastRow: number, section: string, metric: string) {
    return `SUMIFS('Report Data'!$E$2:$E$${lastRow},'Report Data'!$B$2:$B$${lastRow},"${section}",'Report Data'!$C$2:$C$${lastRow},"${metric}")`;
  }

  private getMetric(rows: ReportExportRow[], section: string, metric: string) {
    return rows.find((row) => row.section === section && row.metric === metric)?.value ?? 0;
  }

  private async createBarChart(
    title: string,
    data: Array<{ label: string; value: number }>,
    color: string,
    unit: string,
  ) {
    const width = 720;
    const height = 340;
    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const chartLeft = 210;
    const chartWidth = 430;
    const chartTop = 74;
    const barHeight = 26;
    const gap = 22;
    const safeData = data.length ? data : [{ label: 'No data', value: 0 }];

    const bars = safeData
      .map((item, index) => {
        const y = chartTop + index * (barHeight + gap);
        const barWidth = Math.round((item.value / maxValue) * chartWidth);
        return `<text x="${chartLeft - 14}" y="${y + 18}" text-anchor="end" class="label">${this.escapeSvg(item.label)}</text>
          <rect x="${chartLeft}" y="${y}" width="${chartWidth}" height="${barHeight}" rx="6" class="track"/>
          <rect x="${chartLeft}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${color}"/>
          <text x="${chartLeft + Math.max(barWidth + 10, 16)}" y="${y + 18}" class="value">${this.escapeSvg(this.formatChartValue(item.value, unit))}</text>`;
      })
      .join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>.title{font:700 20px Arial,sans-serif;fill:#172033}.subtitle{font:12px Arial,sans-serif;fill:#62708A}.label{font:12px Arial,sans-serif;fill:#43516A}.value{font:700 12px Arial,sans-serif;fill:#172033}.track{fill:#EEF3F8}</style>
      <rect width="100%" height="100%" rx="18" fill="#FFFFFF"/>
      <text x="28" y="34" class="title">${this.escapeSvg(title)}</text>
      <text x="28" y="56" class="subtitle">Selected report date</text>
      ${bars}
    </svg>`;

    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  private async createStackedAccommodationChart(
    data: Array<{ label: string; occupied: number; free: number }>,
  ) {
    const width = 520;
    const height = 340;
    const maxValue = Math.max(...data.map((item) => item.occupied + item.free), 1);
    const chartLeft = 142;
    const chartWidth = 310;
    const chartTop = 94;
    const barHeight = 30;
    const gap = 38;
    const bars = data
      .map((item, index) => {
        const y = chartTop + index * (barHeight + gap);
        const occupiedWidth = Math.round((item.occupied / maxValue) * chartWidth);
        const freeWidth = Math.round((item.free / maxValue) * chartWidth);
        return `<text x="${chartLeft - 12}" y="${y + 20}" text-anchor="end" class="label">${this.escapeSvg(item.label)}</text>
          <rect x="${chartLeft}" y="${y}" width="${chartWidth}" height="${barHeight}" rx="6" class="track"/>
          <rect x="${chartLeft}" y="${y}" width="${occupiedWidth}" height="${barHeight}" rx="6" fill="#1E73BE"/>
          <rect x="${chartLeft + occupiedWidth}" y="${y}" width="${freeWidth}" height="${barHeight}" fill="#BFD8F6"/>
          <text x="${chartLeft + chartWidth + 10}" y="${y + 20}" class="value">${item.occupied}/${item.occupied + item.free}</text>`;
      })
      .join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>.title{font:700 18px Arial,sans-serif;fill:#172033}.label{font:11px Arial,sans-serif;fill:#43516A}.value{font:700 11px Arial,sans-serif;fill:#172033}.legend{font:11px Arial,sans-serif;fill:#62708A}.track{fill:#EEF3F8}</style>
      <rect width="100%" height="100%" rx="18" fill="#FFFFFF"/>
      <text x="24" y="32" class="title">Accommodation capacity</text>
      <rect x="24" y="50" width="10" height="10" rx="2" fill="#1E73BE"/><text x="40" y="59" class="legend">Occupied</text>
      <rect x="112" y="50" width="10" height="10" rx="2" fill="#BFD8F6"/><text x="128" y="59" class="legend">Available</text>
      ${bars}
    </svg>`;

    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  private toCsvCell(value: string | number) {
    const text = this.safeSpreadsheetText(String(value));
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  private safeSpreadsheetText(value: string) {
    return /^[=+\-@\t\r\n]/.test(value) ? `\t${value}` : value;
  }

  private escapeSvg(value: string) {
    return value.replace(/[&<>"']/g, (character) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]!;
    });
  }

  private formatChartValue(value: number, unit: string) {
    if (unit === 'PHP') return `PHP ${value.toLocaleString('en-PH')}`;
    return `${value.toLocaleString('en-PH')} ${unit}`;
  }

  private toDisplayDate(value: string) {
    return new Intl.DateTimeFormat('en-PH', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00.000Z`));
  }

  private toColumnNumber(column: string) {
    return column.split('').reduce((total, character) => total * 26 + character.charCodeAt(0) - 64, 0);
  }

  private toColumnLetter(column: number) {
    let value = column;
    let result = '';

    while (value > 0) {
      const remainder = (value - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      value = Math.floor((value - 1) / 26);
    }

    return result;
  }
}

const workbookImage = (sheet: ExcelJS.Worksheet, image: Buffer) => {
  const workbook = sheet.workbook;
  return workbook.addImage({ base64: image.toString('base64'), extension: 'png' });
};
