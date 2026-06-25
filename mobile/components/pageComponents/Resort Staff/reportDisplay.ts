import { StatusChipTone } from "@/components/ui/status-chip";
import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
} from "@/types/staffReport.type";

export const reportTypeLabels: Record<ReportType, string> = {
  checkIn: "Check-in",
  checkOut: "Check-out",
  maintenance: "Maintenance",
};

export const reportStatusClasses: Record<ReportStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export const reportSeverityClasses: Record<ReportSeverity, string> = {
  Low: "bg-blue-100 text-blue-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};


export const severityTone: Record<ReportSeverity, StatusChipTone> = {
  Low: "low",
  Medium: "medium",
  High: "high",
};
