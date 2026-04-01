import { bookingApi } from "@/api/booking.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateBookingMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ['booking', 'create'],
        mutationFn: bookingApi.bookAccommodation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking', 'byAccommodation'] })
        }
    })
}

export const useGetBookingsByAccommodationQuery = (accommodationId: string | undefined | null) => {
    return useQuery({
        queryKey: ['booking', 'byAccommodation', accommodationId],
        queryFn: () => bookingApi.getBookingsByAccommodation(accommodationId || ""),
        enabled: !!accommodationId
    })
}