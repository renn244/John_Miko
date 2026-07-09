import type { PaginatedResponse, PaginationParams } from "@/types/pagination.type";

export type MaintenanceStatus = "Pending" | "InProgress" | "Completed" | "Closed";
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

export type AssignedMaintenanceDetail = AssignedMaintenance & {
  assignedTo?: {
    id: string;
    name?: string | null;
    email: string;
    expertise?: MaintenanceExpertise | null;
  } | null;
  report?: {
    id: string;
    bookingId?: string | null;
    type: "checkIn" | "checkOut" | "maintenance";
    createdAt: string;
    booking?: {
      id: string;
      referenceCode: string;
      guestName: string;
      bookingDate: string;
      accommodation: {
        id: string;
        name: string;
        type: string;
      };
    } | null;
  } | null;
};

export type GetAssignedMaintenancesQuery = PaginationParams & {
  search?: string;
};

export type CompleteAssignedMaintenanceRequest = {
  resolutionNotes: string;
  resolutionProofImages: string[];
};

export type PaginatedAssignedMaintenances = PaginatedResponse<AssignedMaintenance>;
