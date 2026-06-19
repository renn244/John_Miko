import { format } from "date-fns";
import type { Maintenance } from "@/types/admin/maintenance.type";

export type ActiveMaintenanceStatus = Exclude<Maintenance["status"], "Closed">;

export const MAINTENANCE_STATUS_ORDER: Maintenance["status"][] = [
  "Pending",
  "InProgress",
  "Completed",
  "Closed",
];

export const ACTIVE_MAINTENANCE_STATUSES: ActiveMaintenanceStatus[] = [
  "Pending",
  "InProgress",
  "Completed",
];

export const getMaintenanceStatusLabel = (status: Maintenance["status"]) => {
  switch (status) {
    case "InProgress":
      return "In Progress";
    default:
      return status;
  }
};

export const getMaintenanceStatusClasses = (status: Maintenance["status"]) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "InProgress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Closed":
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const getMaintenancePriorityClasses = (priority: Maintenance["priority"]) => {
  switch (priority) {
    case "Low":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-200";
  }
};

export const getMaintenancePriorityAccentBorder = (priority: Maintenance["priority"]) => {
  switch (priority) {
    case "Low":
      return "border-slate-300";
    case "Medium":
      return "border-amber-300";
    case "High":
      return "border-orange-400";
  }
};

export const getMaintenanceAssigneeLabel = (ticket: Maintenance) => {
  return ticket.assignedTo?.name || ticket.assignedTo?.email || "Unassigned";
};

export const formatMaintenanceDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return format(date, "PPpp");
};

export const formatMaintenanceShortDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return format(date, "MMM d, yyyy");
};

export const getMaintenanceStatusDate = (
  ticket: Maintenance,
  status: Maintenance["status"]
) => {
  switch (status) {
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

export const sortMaintenanceByRelevantDate = (tickets: Maintenance[]) => {
  return [...tickets].sort((left, right) => {
    const leftDate = getMaintenanceStatusDate(left, left.status) ?? left.updatedAt;
    const rightDate = getMaintenanceStatusDate(right, right.status) ?? right.updatedAt;

    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });
};
