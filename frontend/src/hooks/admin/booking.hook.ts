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

export const useGetBookingById = (bookingId: string | undefined | null) => {
    return useQuery({
        queryKey: ['booking', 'admin', 'byId', bookingId],
        queryFn: () => bookingApi.getBookingById(bookingId || ""),
        enabled: !!bookingId,
    })
}

export const useRescheduleBookingAdminMutation = (bookingId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['booking', 'admin', 'reschedule', bookingId],
        mutationFn: (data: any) => bookingApi.rescheduleBooking(bookingId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] })
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin', 'byId', bookingId] })
        }
    })
}

export const useChangeBookingStatusAdminMutation = (bookingId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['booking', 'admin', 'changeStatus', bookingId],
        mutationFn: (data: "Completed" | "Cancelled") => bookingApi.changeStatus(bookingId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] })
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin', 'byId', bookingId] })
        }
    })
}