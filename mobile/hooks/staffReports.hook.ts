import apiClient from "@/lib/apiClient";
import { toast } from "@/lib/toast";
import type { PaginatedResponse } from "@/types/pagination.type";
import type {
  CreateStaffReportRequest,
  GetStaffReportsQuery,
  StaffReport,
} from "@/types/staffReport.type";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const fetchMyReports = async (query: GetStaffReportsQuery) => {
  const response = await apiClient.get("/staff-reports/byUser", { params: query });

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to fetch staff reports");
  }

  return response.data as PaginatedResponse<StaffReport>;
};

export const useMyStaffReports = (
  filters: Omit<GetStaffReportsQuery, "page" | "limit">,
) => {
  return useInfiniteQuery({
    queryKey: ["staff-reports", "mine", filters],
    queryFn: ({ pageParam }) =>
      fetchMyReports({ ...filters, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 15_000,
  });
};

export const useStaffReportById = (reportId?: string) => {
  return useQuery({
    queryKey: ["staff-reports", "detail", reportId],
    queryFn: async () => {
      const response = await apiClient.get(`/staff-reports/${reportId}`);

      if (response.status === 404) return null;
      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to fetch report details");
      }

      return response.data as StaffReport;
    },
    enabled: Boolean(reportId),
    staleTime: 15_000,
  });
};

export const useCreateStaffReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["staff-reports", "create"],
    mutationFn: async (body: CreateStaffReportRequest) => {
      const response = await apiClient.post("/staff-reports", body);

      if (response.status >= 400) {
        const firstValidationMessage = response.data?.errors?.[0]?.message?.[0];
        throw new Error(
          firstValidationMessage ||
            response.data?.message ||
            "Failed to submit staff report",
        );
      }

      return response.data as StaffReport;
    },
    onSuccess: async () => {
      toast.success("Report submitted successfully.");
      await queryClient.invalidateQueries({
        queryKey: ["staff-reports", "mine"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit staff report",
      );
    },
  });
};
