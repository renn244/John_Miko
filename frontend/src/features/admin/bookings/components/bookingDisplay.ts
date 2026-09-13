import type { Booking } from "@/features/shared/bookings/types/booking.type";

export type BookingStatusDisplay = {
    badgeClassName: string;
    accentBorderClassName: string;
    accentBarClassName: string;
};

const bookingStatusDisplay: Record<Booking["status"], BookingStatusDisplay> = {
    Pending: {
        badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
        accentBorderClassName: "border-l-amber-500",
        accentBarClassName: "bg-amber-500",
    },
    Confirmed: {
        badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
        accentBorderClassName: "border-l-blue-500",
        accentBarClassName: "bg-blue-500",
    },
    Completed: {
        badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
        accentBorderClassName: "border-l-emerald-500",
        accentBarClassName: "bg-emerald-500",
    },
    Cancelled: {
        badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
        accentBorderClassName: "border-l-rose-500",
        accentBarClassName: "bg-rose-500",
    },
};

const fallbackDisplay: BookingStatusDisplay = {
    badgeClassName: "border-slate-200 bg-slate-50 text-slate-700",
    accentBorderClassName: "border-l-slate-300",
    accentBarClassName: "bg-slate-300",
};

export const getBookingStatusDisplay = (status?: Booking["status"] | null) =>
    status ? bookingStatusDisplay[status] : fallbackDisplay;
