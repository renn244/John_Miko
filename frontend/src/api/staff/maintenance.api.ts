import apiClient from "@/lib/apiClient";
import type {
  AssignedMaintenanceScope,
  AssignedMaintenanceDetail,
  AssignedMaintenanceSummary,
  CompleteAssignedMaintenanceDto,
  GetAssignedMaintenancesQuery,
  PaginatedAssignedMaintenances,
} from "@/types/staff/maintenance.type";

export const staffMaintenanceApi = {
  getAssignedMaintenances: async (
    scope: AssignedMaintenanceScope,
    query: GetAssignedMaintenancesQuery,
  ) => {
    const response = await apiClient.get(`/maintenance/assigned/${scope}`, {
      params: query,
    });

    if (response.status >= 400) {
      throw new Error(
        response.data?.message ||
          "An error occurred while fetching assigned maintenance tickets.",
      );
    }

    return response.data as PaginatedAssignedMaintenances;
  },
  getAssignedMaintenanceSummary: async (
    query: Pick<GetAssignedMaintenancesQuery, "search" | "status" | "priority">,
  ) => {
    const response = await apiClient.get("/maintenance/assigned/summary", {
      params: query,
    });

    if (response.status >= 400) {
      throw new Error(
        response.data?.message ||
          "An error occurred while fetching assigned maintenance summary.",
      );
    }

    return response.data as AssignedMaintenanceSummary;
  },
  getAssignedMaintenanceById: async (id: string) => {
    const response = await apiClient.get(`/maintenance/assigned/${id}`);
    if (response.status === 404) return null;
    if (response.status >= 400)
      throw new Error(
        response.data?.message ||
          "An error occurred while fetching this maintenance ticket.",
      );
    return response.data as AssignedMaintenanceDetail;
  },
  startAssignedMaintenance: async (id: string) => {
    const response = await apiClient.patch(`/maintenance/${id}/start`);
    if (response.status >= 400)
      throw new Error(response.data?.message || "Unable to start maintenance.");
    return response.data as AssignedMaintenanceDetail;
  },
  completeAssignedMaintenance: async (
    id: string,
    data: CompleteAssignedMaintenanceDto,
  ) => {
    const response = await apiClient.patch(`/maintenance/${id}/complete`, data);
    if (response.status >= 400)
      throw new Error(
        response.data?.message || "Unable to complete maintenance.",
      );
    return response.data as AssignedMaintenanceDetail;
  },
};
