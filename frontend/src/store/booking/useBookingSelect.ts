import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type BookingSelectStore = {
    bookingDate: Date | undefined;
    bookingType: "OverNight" | "DayStay" | undefined;
    setBookingDate: (date: Date | undefined) => void;
    setBookingType: (type: "OverNight" | "DayStay" | undefined) => void;

    reset: () => void;
}

export const useBookingSelectStore = create<BookingSelectStore>()(
    persist(
        (set) => ({
            bookingDate: undefined,
            bookingType: undefined,

            setBookingDate: (date) =>
                set({ bookingDate: date, bookingType: undefined }),

            setBookingType: (type) =>
                set({ bookingType: type }),

            reset: () =>
                set({
                    bookingDate: undefined,
                    bookingType: undefined,
                }),
        }),
        {
            name: "booking-select-storage",
            storage: createJSONStorage(() => sessionStorage),

            onRehydrateStorage: () => (state) => {
                if(state?.bookingDate) {
                    state.bookingDate = new Date(state.bookingDate);
                }
            }
        }
    )
);
