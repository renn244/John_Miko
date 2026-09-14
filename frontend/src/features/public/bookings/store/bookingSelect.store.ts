import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AccommodationStayOption } from '@/features/shared/accommodations/types/accommodation.type';

type BookingSelectStore = {
    bookingDate: Date | undefined;
    bookingType: string | undefined;
    stayOption: AccommodationStayOption | undefined;
    setBookingDate: (date: Date | undefined) => void;
    setBookingType: (type: string | undefined) => void;
    setStayOption: (stayOption: AccommodationStayOption | undefined) => void;

    reset: () => void;
}

export const useBookingSelectStore = create<BookingSelectStore>()(
    persist(
        (set) => ({
            bookingDate: undefined,
            bookingType: undefined,
            stayOption: undefined,

            setBookingDate: (date) =>
                set({ bookingDate: date, bookingType: undefined, stayOption: undefined }),

            setBookingType: (type) =>
                set({ bookingType: type }),

            setStayOption: (stayOption) =>
                set({ stayOption, bookingType: stayOption?.id }),

            reset: () =>
                set({
                    bookingDate: undefined,
                    bookingType: undefined,
                    stayOption: undefined,
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
