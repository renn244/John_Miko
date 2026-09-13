import { bookingApi } from "@/features/shared/bookings/api/booking.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['booking', 'create'],
    mutationFn: bookingApi.bookAccommodation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', 'byAccommodation'] }),
  });
};

export const useGetBookingsByUserQuery = (query?: { status: string }) =>
  useQuery({
    queryKey: ['booking', 'byUser', query],
    queryFn: () => bookingApi.getBookingsByUser(query),
  });
