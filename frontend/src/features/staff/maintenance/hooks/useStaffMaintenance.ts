import { staffMaintenanceApi } from "@/features/staff/maintenance/api/staffMaintenance.api";
import type {
  AssignedMaintenanceScope,
  CompleteAssignedMaintenanceDto,
  GetAssignedMaintenancesQuery,
} from "@/features/staff/maintenance/types/maintenance.type";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useAssignedMaintenances = (
  scope: AssignedMaintenanceScope,
  filters: Pick<
    GetAssignedMaintenancesQuery,
    "search" | "status" | "priority"
  > = {},
  limit = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["maintenance", "assigned", scope, filters, limit],
    queryFn: ({ pageParam }) =>
      staffMaintenanceApi.getAssignedMaintenances(scope, {
        page: pageParam,
        limit,
        search: filters.search?.trim() || undefined,
        status: filters.status,
        priority: filters.priority,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
};

export const useAssignedMaintenanceSummary = (
  filters: Pick<
    GetAssignedMaintenancesQuery,
    "search" | "status" | "priority"
  > = {},
  enabled = true,
) =>
  useQuery({
    queryKey: ["maintenance", "assigned", "summary", filters],
    queryFn: () =>
      staffMaintenanceApi.getAssignedMaintenanceSummary({
        search: filters.search?.trim() || undefined,
        status: filters.status,
        priority: filters.priority,
      }),
    enabled,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });

export const useAssignedMaintenanceById = (id?: string) =>
  useQuery({
    queryKey: ["maintenance", "assigned", "detail", id],
    queryFn: () => staffMaintenanceApi.getAssignedMaintenanceById(id || ""),
    enabled: Boolean(id),
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

const invalidateAssignedMaintenance = (
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["maintenance", "assigned"] }),
    queryClient.invalidateQueries({
      queryKey: ["maintenance", "assigned", "detail", id],
    }),
  ]);

export const useStartAssignedMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffMaintenanceApi.startAssignedMaintenance,
    onSuccess: async (_, id) => {
      toast.success("Maintenance started.");
      await invalidateAssignedMaintenance(queryClient, id);
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useCompleteAssignedMaintenance = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CompleteAssignedMaintenanceDto) =>
      staffMaintenanceApi.completeAssignedMaintenance(id, data),
    onSuccess: async () => {
      toast.success("Maintenance marked as completed.");
      await invalidateAssignedMaintenance(queryClient, id);
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useReopenAssignedMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffMaintenanceApi.reopenAssignedMaintenance,
    onSuccess: async (_, id) => {
      toast.success("Ticket reopened and returned to in progress.");
      await invalidateAssignedMaintenance(queryClient, id);
    },
    onError: (error) => toast.error(error.message),
  });
};
