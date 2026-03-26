import { bookingApi } from "@/api/booking.api"
import { useMutation } from "@tanstack/react-query"

export const useCreateBookingMutation = () => {
    return useMutation({
        mutationKey: ['booking', 'create'],
        mutationFn: bookingApi.bookAccommodation
    })
}