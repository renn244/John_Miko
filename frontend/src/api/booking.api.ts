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
    getBookings: async (query: { search?: string; status?: string; paymentType?: string; accommodationId?: string; bookingDate?: string }) => {
        const response = await apiClient.get('/booking', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to fetch bookings');
        }

        return response.data as BookingWithAccommodation[]
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

        if(response.status === 404) {
            return null
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to fetch booking details');
        }
        
        return response.data as BookingWithAccommodation;
    },
    getBookingsByUser: async () => {
        const response = await apiClient.get('/booking/byUser')

        return response.data as BookingWithAccommodation[];
    },
    rescheduleBooking: async (bookingId: string, data: any) => {
        const response = await apiClient.patch(`/booking/reschedule/${bookingId}`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to reschedule booking');
        }

        return response.data as BookingWithAccommodation;
    }
}