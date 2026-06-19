import apiClient from "@/lib/apiClient";
import type { PaginatedResponse } from "@/types/pagination.type";
import type {
  GetStaffBookingsQuery,
  StaffBookingDetails,
  StaffBookingSummary,
} from "@/types/staffBooking.type";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchStaffBookings = async (query: GetStaffBookingsQuery) => {
  const response = await apiClient.get("/booking/staff", { params: query });

  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to fetch bookings");
  }

  return response.data as PaginatedResponse<StaffBookingSummary>;
};

export const useStaffBookings = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ["staff-bookings", { search }],
    queryFn: ({ pageParam }) =>
      fetchStaffBookings({
        search: search || undefined,
        page: pageParam,
        limit: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 15_000,
  });
};

export const useStaffBookingById = (bookingId?: string) => {
  return useQuery({
    queryKey: ["staff-bookings", "detail", bookingId],
    queryFn: async () => {
      const response = await apiClient.get(`/booking/staff/${bookingId}`);

      if (response.status === 404) return null;
      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to fetch booking details");
      }

      return response.data as StaffBookingDetails;
    },
    enabled: Boolean(bookingId),
    staleTime: 15_000,
  });
};
