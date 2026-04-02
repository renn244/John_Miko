import { addDays, format } from "date-fns";

const getCheckInOut = (bookingDate: string, timeSlot: "DayStay" | "OverNight") => {
    const date = new Date(bookingDate);
    const nextDay = addDays(date, 1);

    if (timeSlot === "DayStay") {
        return {
            checkIn: format(date, 'PPP') + " · 12:00 PM",
            checkInDayOfTheWeek: format(date, 'EEEE'),
            checkOut: format(nextDay, 'PPP') + " · 1:00 AM",
            checkOutDayOfTheWeek: format(nextDay, 'EEEE'),
        };
    } else {
        return {
            checkIn: format(date, 'PPP') + " · 1:00 AM",
            checkInDayOfTheWeek: format(date, 'EEEE'),
            checkOut: format(date, 'PPP') + " · 11:00 PM",
            checkOutDayOfTheWeek: format(date, 'EEEE'),
        }
    }
};

export default getCheckInOut;