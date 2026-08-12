import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
} from "@/types/staff/resort.type";

export const reportTypeLabels: Record<ReportType, string> = {
  checkIn: "Check-in",
  checkOut: "Check-out",
  maintenance: "Maintenance",
};
export const reportStatusClass: Record<ReportStatus, string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-red-200 bg-red-50 text-red-700",
};
export const reportSeverityClass: Record<ReportSeverity, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  High: "border-red-200 bg-red-50 text-red-700",
};
export const reportAccent: Record<ReportStatus, string> = {
  Pending: "bg-amber-400",
  Approved: "bg-emerald-500",
  Rejected: "bg-red-500",
};
export const formatResortDate = (
  value?: string | null,
  includeTime = false,
) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
      }).format(date);
};
export const reportReference = (id: string) =>
  `RPT-${id.slice(-4).toUpperCase()}`;
