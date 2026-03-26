
export function getBookingDates(date: Date, stayType: 'overnight' | 'daystay') {
  const checkIn = new Date(date);
  const checkOut = new Date(date);

  if (stayType === 'overnight') {
    checkIn.setHours(12, 0);
    checkOut.setDate(checkOut.getDate() + 1);
    checkOut.setHours(1, 0);
  } else {
    checkIn.setHours(1, 0);
    checkOut.setHours(11, 0);
  }

  return { checkIn, checkOut };
}