import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type {
  Booking,
  BookingOverview,
  BookingWithAccommodation,
  BookingWithPaymentInfo,
  CreateManualBookingDto,
  CreateWalkInBookingDto,
  GetBookingsQuery,
} from "@/features/shared/bookings/types/booking.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const adminBookingApi = {
  createManualBooking: async (data: CreateManualBookingDto) => {
    const response = await apiClient.post('/booking/manual', data);
    if (response.status === 400) throw new ValidationError(response.data);
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to create booking');
    return response.data as BookingWithPaymentInfo;
  },
  createWalkInBooking: async (data: CreateWalkInBookingDto) => {
    const response = await apiClient.post('/booking/walk-in', data);
    if (response.status === 400) throw new ValidationError(response.data);
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to record walk-in');
    return response.data as BookingWithPaymentInfo;
  },
  getBookings: async (query?: GetBookingsQuery) => {
    const response = await apiClient.get('/booking', { params: query });
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to fetch bookings');
    return response.data as PaginatedResponse<BookingWithAccommodation>;
  },
  getBookingOverview: async (date?: string) => {
    const response = await apiClient.get('/booking/overview', { params: { date } });
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to fetch booking overview');
    return response.data as BookingOverview;
  },
  rescheduleBooking: async (bookingId: string, data: unknown) => {
    const response = await apiClient.patch(`/booking/reschedule/${bookingId}`, data);
    if (response.status === 400) throw new ValidationError(response.data);
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to reschedule booking');
    return response.data as BookingWithAccommodation;
  },
  changeStatus: async (bookingId: string, status: string) => {
    const response = await apiClient.patch(`/booking/changestatus/${bookingId}`, { status });
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to change booking status');
    return response.data as Booking;
  },
};
