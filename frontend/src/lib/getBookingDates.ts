
export function getBookingDates(date: Date, stayType: 'OverNight' | 'DayStay') {
  const checkIn = new Date(date);
  const checkOut = new Date(date);

  if (stayType === 'OverNight') {
    checkIn.setHours(19, 0);
    checkOut.setDate(checkOut.getDate() + 1);
    checkOut.setHours(5, 0); // 5 AM the next day
  } else {
    checkIn.setHours(8, 0); // 8 AM
    checkOut.setHours(17, 0); // 5 PM
  }

  return { checkIn, checkOut };
}