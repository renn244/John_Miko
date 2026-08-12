import { staffResortApi } from "@/api/staff/resort.api";
import type { ResortReportsFilters } from "@/types/staff/resort.type";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useResortBookings = (search?: string) =>
  useInfiniteQuery({
    queryKey: ["staff", "resort", "bookings", search],
    queryFn: ({ pageParam }) =>
      staffResortApi.getBookings({
        page: pageParam,
        limit: 10,
        search: search?.trim() || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (page) =>
      page.meta.hasNextPage ? page.meta.page + 1 : undefined,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
export const useResortBookingById = (id?: string) =>
  useQuery({
    queryKey: ["staff", "resort", "booking", id],
    queryFn: () => staffResortApi.getBookingById(id || ""),
    enabled: Boolean(id),
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
export const useMyResortReports = (filters: ResortReportsFilters) =>
  useInfiniteQuery({
    queryKey: ["staff", "resort", "reports", filters],
    queryFn: ({ pageParam }) =>
      staffResortApi.getReports({ ...filters, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (page) =>
      page.meta.hasNextPage ? page.meta.page + 1 : undefined,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
export const useResortReportById = (id?: string) =>
  useQuery({
    queryKey: ["staff", "resort", "report", id],
    queryFn: () => staffResortApi.getReportById(id || ""),
    enabled: Boolean(id),
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
export const useCreateResortReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffResortApi.createReport,
    onSuccess: async () => {
      toast.success("Report submitted successfully.");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["staff", "resort", "reports"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staff", "resort", "bookings"],
        }),
      ]);
    },
    onError: (error) => toast.error(error.message),
  });
};
