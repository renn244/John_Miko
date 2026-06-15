import { format } from "date-fns";
import { getBookingDates } from "./getBookingDates";
import { formatStayOptionTime, type StayOptionTimeInput } from "./stayOptionTime";

type GetCheckInOutInput = StayOptionTimeInput & {
    bookingDate: string;
    label?: string | null;
};

const getCheckInOut = ({ bookingDate, startTime, endTime }: GetCheckInOutInput) => {
    const baseDate = new Date(bookingDate);
    const { checkIn, checkOut } = getBookingDates(baseDate, { startTime, endTime });

    const checkInTime = startTime ? ` ${formatStayOptionTime(startTime)}` : "";
    const checkOutTime = endTime ? ` ${formatStayOptionTime(endTime)}` : "";

    return {
        checkIn: format(checkIn, 'PPP') + checkInTime,
        checkInDayOfTheWeek: format(checkIn, 'EEEE'),
        checkOut: format(checkOut, 'PPP') + checkOutTime,
        checkOutDayOfTheWeek: format(checkOut, 'EEEE'),
    };
};

export default getCheckInOut;
