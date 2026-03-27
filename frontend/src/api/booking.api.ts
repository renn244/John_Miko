import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { Booking, BookingWithAccommodation } from "@/types/booking.types";

export const bookingApi = {
    bookAccommodation: async (data: any) => {
        const response = await apiClient.post('/booking', data)

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        // handle this conflict booking error correctly in the form later
        // {
        //     "statusCode": 409,
        //     "message": "Accommodation is already booked for the selected date and time slot",
        //     "timeStamp": "2026-03-27T06:16:29.089Z"
        // }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to book accommodation');
        }

        return response.data as Booking;
    },
    getBookingsByAccommodation: async (accommodationId: string) => {
        const response = await apiClient.get(`/booking/byAccommodation/${accommodationId}`)
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to fetch bookings for accommodation');
        }

        return response.data as { bookingDate: string, bookingStatus: string, timeSlotsOccupied: string[] }[];
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