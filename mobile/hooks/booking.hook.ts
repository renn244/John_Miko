import apiClient from "@/lib/apiClient";
import type {
    BookingWithAccommodation,
    BookingWithAccommodationAndPreOrder,
    GetBookingsQuery
} from "@/types/booking.type";
import type { PaginatedResponse } from "@/types/pagination.type";
import { useQuery } from "@tanstack/react-query";

export const useBookingsQuery = (query?: GetBookingsQuery) => {
  return useQuery({
    queryKey: ["bookings", query],
    queryFn: () => async (query?: GetBookingsQuery) => {
        const response = await apiClient.get("/booking", { params: query });

        if (response.status >= 400) {
            throw new Error(response.data?.message || "Failed to fetch bookings");
        }

        return response.data as PaginatedResponse<BookingWithAccommodation>;
    },
  });
};

export const useBookingByIdQuery = (bookingId?: string) => {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => async (bookingId: string) => {
        const response = await apiClient.get(`/booking/byBookingId/${bookingId}`);

        if (response.status === 404) {
            return null;
        }

        if (response.status >= 400) {
            throw new Error(response.data?.message || "Failed to fetch booking details");
        }

        return response.data as BookingWithAccommodationAndPreOrder;
    },
    enabled: Boolean(bookingId),
  });
};
