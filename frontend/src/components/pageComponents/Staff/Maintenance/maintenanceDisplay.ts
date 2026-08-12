import { format, isToday, isYesterday } from "date-fns";
import type {
  AssignedMaintenance,
  MaintenancePriority,
  MaintenanceStatus,
} from "@/types/staff/maintenance.type";

export const getMaintenancePriorityAccentClassName = (
  priority: MaintenancePriority,
) => {
  switch (priority) {
    case "Low":
      return "bg-[#0E33F3]";
    case "Medium":
      return "bg-amber-400";
    case "High":
      return "bg-red-600";
  }
};

export const getMaintenancePriorityChipClassName = (
  priority: MaintenancePriority,
) => {
  switch (priority) {
    case "Low":
      return "border-blue-100 bg-blue-50 text-blue-700";
    case "Medium":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "High":
      return "border-red-200 bg-red-50 text-red-700";
  }
};

export const getMaintenanceStatusChipClassName = (
  status: MaintenanceStatus,
) => {
  switch (status) {
    case "Pending":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "InProgress":
      return "border-blue-100 bg-blue-50 text-blue-700";
    case "Completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Closed":
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
};

export const getMaintenanceStatusLabel = (status: MaintenanceStatus) =>
  status === "InProgress" ? "In Progress" : status;

export const getRelevantMaintenanceDate = (ticket: AssignedMaintenance) => {
  switch (ticket.status) {
    case "Pending":
      return ticket.createdAt;
    case "InProgress":
      return ticket.startedAt ?? ticket.createdAt;
    case "Completed":
      return ticket.resolvedAt ?? ticket.updatedAt;
    case "Closed":
      return ticket.closedAt ?? ticket.updatedAt;
  }
};

export const formatMaintenanceDateTimeLabel = (value?: string | null) => {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  const dayLabel = isToday(date)
    ? "Today"
    : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMM d");

  return `${dayLabel}, ${format(date, "h:mm a")}`;
};
