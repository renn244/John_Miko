import { applyStayOptionTime, isOvernightStayOption, type StayOptionTimeInput } from "./stayOptionTime";

export function getBookingDates(date: Date, stayOption?: StayOptionTimeInput) {
  const checkIn = new Date(date);
  const checkOut = new Date(date);

  applyStayOptionTime(checkIn, stayOption?.startTime);
  applyStayOptionTime(checkOut, stayOption?.endTime);

  if (stayOption && isOvernightStayOption(stayOption)) {
    checkOut.setDate(checkOut.getDate() + 1);
  }

  return { checkIn, checkOut };
}
