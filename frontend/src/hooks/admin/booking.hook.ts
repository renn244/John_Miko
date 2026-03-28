import { bookingApi } from "@/api/booking.api";
import { toDateOnly } from "@/lib/date.util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateBookingAdminMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['booking', 'create', 'admin'],
        mutationFn: bookingApi.bookAccommodation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] })
        }
    })
}

export const useGetBookingsAdminQuery = (query: { search?: string; status?: string; paymentType?: string; accommodationId?: string; bookingDate?: string }) => {
    const modifiedQuery = {
        ...query,
        bookingDate: query.bookingDate ? toDateOnly(new Date(query.bookingDate)) : undefined
    }
    
    return useQuery({
        queryKey: ['booking', 'admin', modifiedQuery],
        queryFn: () => bookingApi.getBookings(modifiedQuery),
        refetchOnWindowFocus: false,
    })
}