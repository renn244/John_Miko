import { create } from 'zustand';

type BookingSelectStore = {
    bookingDate: Date | undefined;
    bookingType: "OverNight" | "DayStay" | undefined;
    setBookingDate: (date: Date | undefined) => void;
    setBookingType: (type: "OverNight" | "DayStay" | undefined) => void;

    reset: () => void;
}

export const useBookingSelectStore = create<BookingSelectStore>((set) => ({
    bookingDate: undefined,
    bookingType: undefined,
    setBookingDate: (date) => set({ bookingDate: date, bookingType: undefined }),
    setBookingType: (type) => set({ bookingType: type }),

    reset: () => set({ bookingDate: undefined, bookingType: undefined }),
}))