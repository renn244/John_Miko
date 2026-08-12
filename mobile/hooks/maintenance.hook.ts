import apiClient from "@/lib/apiClient";
import { toast } from "@/lib/toast";
import type {
  AssignedMaintenanceDetail,
  AssignedMaintenanceSummary,
  CompleteAssignedMaintenanceRequest,
  GetAssignedMaintenancesQuery,
  PaginatedAssignedMaintenances,
} from "@/types/maintenance.type";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchAssignedMaintenances = async (
  scope: "active" | "history",
  query: GetAssignedMaintenancesQuery,
) => {
  const response = await apiClient.get(`/maintenance/assigned/${scope}`, {
    params: query,
  });

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to fetch maintenance tickets");
  }

  return response.data as PaginatedAssignedMaintenances;
};

export const useAssignedMaintenances = (
  scope: "active" | "history",
  search?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["maintenance", "assigned", scope, search],
    queryFn: ({ pageParam }) =>
      fetchAssignedMaintenances(scope, {
        page: pageParam,
        limit: 10,
        search: search?.trim() || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 15_000,
  });
};

export const useAssignedMaintenanceSummary = (search?: string, enabled = true) => {
  return useQuery({
    queryKey: ["maintenance", "assigned", "summary", search],
    queryFn: async () => {
      const response = await apiClient.get("/maintenance/assigned/summary", {
        params: { search: search?.trim() || undefined },
      });

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to fetch maintenance summary");
      }

      return response.data as AssignedMaintenanceSummary;
    },
    enabled,
    staleTime: 15_000,
  });
};

export const useAssignedMaintenanceById = (maintenanceId?: string) => {
  return useQuery({
    queryKey: ["maintenance", "assigned", "detail", maintenanceId],
    queryFn: async () => {
      const response = await apiClient.get(`/maintenance/assigned/${maintenanceId}`);

      if (response.status === 404) return null;
      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to fetch maintenance details");
      }

      return response.data as AssignedMaintenanceDetail;
    },
    enabled: Boolean(maintenanceId),
    staleTime: 15_000,
  });
};

export const useStartAssignedMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["maintenance", "assigned", "start"],
    mutationFn: async (maintenanceId: string) => {
      const response = await apiClient.patch(`/maintenance/${maintenanceId}/start`);

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to start maintenance");
      }

      return response.data as AssignedMaintenanceDetail;
    },
    onSuccess: async (data) => {
      toast.success("Maintenance started.");
      await queryClient.invalidateQueries({ queryKey: ["maintenance", "assigned"] });
      await queryClient.invalidateQueries({
        queryKey: ["maintenance", "assigned", "detail", data.id],
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to start maintenance");
    },
  });
};

export const useCompleteAssignedMaintenance = (maintenanceId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["maintenance", "assigned", "complete", maintenanceId],
    mutationFn: async (data: CompleteAssignedMaintenanceRequest) => {
      const response = await apiClient.patch(`/maintenance/${maintenanceId}/complete`, data);

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to complete maintenance");
      }

      return response.data as AssignedMaintenanceDetail;
    },
    onSuccess: async (data) => {
      toast.success("Maintenance marked as completed.");
      await queryClient.invalidateQueries({ queryKey: ["maintenance", "assigned"] });
      await queryClient.invalidateQueries({
        queryKey: ["maintenance", "assigned", "detail", data.id],
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to complete maintenance");
    },
  });
};
