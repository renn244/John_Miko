import { bookingApi } from "@/features/shared/bookings/api/booking.api";
import { useQuery } from "@tanstack/react-query";

export const useGetBookingsByAccommodationQuery = (accommodationId: string | undefined | null) =>
  useQuery({
    queryKey: ['booking', 'byAccommodation', accommodationId],
    queryFn: () => bookingApi.getBookingsByAccommodation(accommodationId || ''),
    enabled: !!accommodationId,
  });

export const useGetBookingByIdQuery = (bookingId: string | undefined | null) =>
  useQuery({
    queryKey: ['booking', 'admin', 'byId', bookingId],
    queryFn: () => bookingApi.getBookingById(bookingId || ''),
    enabled: !!bookingId,
  });
