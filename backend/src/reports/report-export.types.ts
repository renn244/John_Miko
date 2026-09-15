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
};

export type DownloadableReport = {
  buffer: Buffer;
  contentType: string;
  fileName: string;
};
