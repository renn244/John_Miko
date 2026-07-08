import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { Booking, BookingOverview, BookingWithAccommodation, BookingWithAccommodationAndFeedback, BookingWithAccommodationAndPreOrderAndPayment, BookingWithPaymentInfo, GetBookingsQuery } from "@/types/booking.types";
import type { PaginatedResponse } from "@/types/pagination.type";

export type CreateManualBookingDto = {
    accommodationId: string;
    name: string;
    email: string;
    contactNo: string;
    numberOfGuests: number;
    checkIn: Date;
    stayOptionId: string;
    paymentType: "Partial" | "Full";
};

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

        return response.data as BookingWithPaymentInfo;
    },
    createManualBooking: async (data: CreateManualBookingDto) => {
        const response = await apiClient.post('/booking/manual', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to create booking');
        }

        return response.data as BookingWithPaymentInfo;
    },
    getBookings: async (query?: GetBookingsQuery) => {
        const response = await apiClient.get('/booking', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to fetch bookings');
        }

        return response.data as PaginatedResponse<BookingWithAccommodation>;
    },
    getBookingOverview: async (date?: string) => {
        const response = await apiClient.get('/booking/overview', {
            params: { date },
        });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to fetch booking overview');
        }

        return response.data as BookingOverview;
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
        
        return response.data as BookingWithAccommodationAndPreOrderAndPayment;
    },
    getBookingsByUser: async (query?:  { status: string }) => {
        const response = await apiClient.get('/booking/byUser', { params: query })

        return response.data as BookingWithAccommodationAndFeedback[];
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
    },
    changeStatus: async (bookingId: string, status: string) => {
        const response = await apiClient.patch(`/booking/changestatus/${bookingId}`, { status });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to change booking status');
        }

        return response.data as Booking;
    }
}
