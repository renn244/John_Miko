import { adminBookingApi } from "@/features/admin/bookings/api/adminBooking.api";
import { bookingApi } from "@/features/shared/bookings/api/booking.api";
import { toDateOnly } from "@/lib/date.util";
import type { BookingWithAccommodationAndPreOrderAndPayment, GetBookingsQuery } from "@/features/shared/bookings/types/booking.type";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateBookingAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationKey: ['booking', 'create', 'admin'], mutationFn: adminBookingApi.createManualBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] }) });
};
export const useCreateWalkInBookingAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationKey: ['booking', 'create', 'walk-in'], mutationFn: adminBookingApi.createWalkInBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] }) });
};
export const useGetBookingsAdminQuery = (query: GetBookingsQuery) => {
  const modifiedQuery = { ...query, bookingDate: query.bookingDate ? toDateOnly(new Date(query.bookingDate)) : undefined, page: query.page || 1, limit: query.limit || 10 } satisfies GetBookingsQuery;
  return useQuery({ queryKey: ['booking', 'admin', modifiedQuery], queryFn: () => adminBookingApi.getBookings(modifiedQuery), refetchOnWindowFocus: false, placeholderData: (prev) => prev });
};
export const useGetBookingById = (bookingId: string | undefined | null) => useQuery({ queryKey: ['booking', 'admin', 'byId', bookingId], queryFn: () => bookingApi.getBookingById(bookingId || ''), enabled: !!bookingId });
export const useRescheduleBookingAdminMutation = (bookingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationKey: ['booking', 'admin', 'reschedule', bookingId], mutationFn: (data: unknown) => adminBookingApi.rescheduleBooking(bookingId, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] }); queryClient.invalidateQueries({ queryKey: ['booking', 'admin', 'byId', bookingId] }); } });
};
export const useChangeBookingStatusAdminMutation = (bookingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationKey: ['booking', 'admin', 'changeStatus', bookingId], mutationFn: (data: 'Completed' | 'Cancelled') => adminBookingApi.changeStatus(bookingId, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] }); queryClient.invalidateQueries({ queryKey: ['booking', 'admin', 'byId', bookingId] }); } });
};
export const useGetOverviewBookingsQuery = (limit = 20) => useQuery({ queryKey: ['booking', 'admin', 'overview', limit], queryFn: () => adminBookingApi.getBookings({ page: 1, limit }), refetchOnWindowFocus: false });
export const useGetBookingOverviewQuery = (date?: string) => useQuery({ queryKey: ['booking', 'admin', 'operational-overview', date], queryFn: () => adminBookingApi.getBookingOverview(date), refetchOnWindowFocus: false });
export const useGetBookingDetailsBulkQuery = (bookingIds: string[]) => {
  const queries = useQueries({ queries: bookingIds.map((bookingId) => ({ queryKey: ['booking', 'admin', 'byId', bookingId], queryFn: () => bookingApi.getBookingById(bookingId), enabled: !!bookingId, refetchOnWindowFocus: false })) });
  const isLoading = queries.some((query) => query.isLoading);
  const data = queries.map((query) => query.data).filter((item): item is BookingWithAccommodationAndPreOrderAndPayment => !!item);
  return { queries, isLoading, data };
};
