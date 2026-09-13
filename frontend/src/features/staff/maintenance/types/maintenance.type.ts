import type {
  PaginatedResponse,
  PaginationParams,
} from "@/types/pagination.type";

export type MaintenanceStatus =
  | "Pending"
  | "InProgress"
  | "Completed"
  | "Closed";
export type MaintenancePriority = "Low" | "Medium" | "High";
export type MaintenanceExpertise = "Electrical" | "Pool" | "Construction";

export type AssignedMaintenance = {
  id: string;
  title: string;
  description: string;
  imagesUrl: string[];
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  expertise: MaintenanceExpertise;
  assignedToId?: string | null;
  resolutionNotes?: string | null;
  resolutionProofImages?: string[];
  startedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssignedMaintenanceScope = "active" | "history";

export type GetAssignedMaintenancesQuery = PaginationParams & {
  search?: string;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
};

export type AssignedMaintenanceSummary = {
  pending: number;
  inProgress: number;
  highPriority: number;
};

export type PaginatedAssignedMaintenances =
  PaginatedResponse<AssignedMaintenance>;

export type AssignedMaintenanceDetail = AssignedMaintenance & {
  report?: {
    id: string;
    booking?: {
      id: string;
      referenceCode: string;
      guestName: string;
      accommodation: { id: string; name: string; type: string };
    } | null;
  } | null;
};

export type CompleteAssignedMaintenanceDto = {
  resolutionNotes: string;
  resolutionProofImages: string[];
};
