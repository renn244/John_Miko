import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type {
  BookingWithAccommodationAndFeedback,
  BookingWithAccommodationAndPreOrderAndPayment,
  BookingWithPaymentInfo,
} from "@/features/shared/bookings/types/booking.type";

export const bookingApi = {
  bookAccommodation: async (data: unknown) => {
    const response = await apiClient.post('/booking', data);
    if (response.status === 400) throw new ValidationError(response.data);
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to book accommodation');
    return response.data as BookingWithPaymentInfo;
  },
  getBookingsByAccommodation: async (accommodationId: string) => {
    const response = await apiClient.get(`/booking/byAccommodation/${accommodationId}`);
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to fetch bookings for accommodation');
    return response.data as { bookingDate: string; bookingStatus: string; timeSlotsOccupied: string[] }[];
  },
  getBookingById: async (bookingId: string) => {
    const response = await apiClient.get(`/booking/byBookingId/${bookingId}`);
    if (response.status === 404) return null;
    if (response.status >= 400) throw new Error(response.data.message || 'Failed to fetch booking details');
    return response.data as BookingWithAccommodationAndPreOrderAndPayment;
  },
  getBookingsByUser: async (query?: { status: string }) => {
    const response = await apiClient.get('/booking/byUser', { params: query });
    return response.data as BookingWithAccommodationAndFeedback[];
  },
};
