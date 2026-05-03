import { addDays, format } from "date-fns";
import { TIME_SLOT } from "./constant/TIME_SLOT.constant";

const getCheckInOut = (bookingDate: string, timeSlot: "DayStay" | "OverNight") => {
    const date = new Date(bookingDate);
    const nextDay = addDays(date, 1);

    if (timeSlot === "DayStay") {
        return {
            checkIn: format(date, 'PPP') + " " + TIME_SLOT.DAY_STAY.CHECK_IN,
            checkInDayOfTheWeek: format(date, 'EEEE'),
            checkOut: format(nextDay, 'PPP') + " " + TIME_SLOT.DAY_STAY.CHECK_OUT,
            checkOutDayOfTheWeek: format(nextDay, 'EEEE'),
        };
    } else {
        return {
            checkIn: format(date, 'PPP') + " " + TIME_SLOT.OVERNIGHT.CHECK_IN,
            checkInDayOfTheWeek: format(date, 'EEEE'),
            checkOut: format(date, 'PPP') + " " + TIME_SLOT.OVERNIGHT.CHECK_OUT,
            checkOutDayOfTheWeek: format(date, 'EEEE'),
        }
    }
};

export default getCheckInOut;