import apiClient from "@/lib/apiClient";
import type { Booking, BookingWithAccommodation } from "@/types/booking.types";

export const bookingApi = {
    bookAccommodation: async (data: any) => {
        const response = await apiClient.post('/booking', data)

        return response.data as Booking;
    },
    getBookingsByAccommodation: async (accommodationId: string) => {
        const response = await apiClient.get(`/booking/byAccommodation/${accommodationId}`)
        
        return response.data as BookingWithAccommodation[];
    },
    getBookingById: async (bookingId: string) => {
        const response = await apiClient.get(`/booking/byBookingId/${bookingId}`)
        
        return response.data as Booking;
    },
    getBookingsByUser: async () => {
        const response = await apiClient.get('/booking/byUser')

        return response.data as BookingWithAccommodation[];
    },
}