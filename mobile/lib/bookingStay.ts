type StayOptionTime = string | null | undefined;

const parseStayOptionTime = (time?: StayOptionTime) => {
  if (!time) return null;

  const match = time.match(/(?:T|^)(\d{2}):(\d{2})(?::\d{2})?/);
  if (!match) return null;

  return {
    hours: Number(match[1]),
    minutes: Number(match[2]),
  };
};

const applyStayOptionTime = (date: Date, time?: StayOptionTime) => {
  const parsed = parseStayOptionTime(time);
  if (!parsed) return;
  date.setHours(parsed.hours, parsed.minutes, 0, 0);
};

export const getBookingStayDates = ({
  bookingDate,
  startTime,
  endTime,
}: {
  bookingDate: string;
  startTime?: StayOptionTime;
  endTime?: StayOptionTime;
}) => {
  const dateOnly = bookingDate.slice(0, 10);
  const checkIn = new Date(`${dateOnly}T00:00:00`);
  const checkOut = new Date(checkIn);
  const start = parseStayOptionTime(startTime);
  const end = parseStayOptionTime(endTime);

  applyStayOptionTime(checkIn, startTime);
  applyStayOptionTime(checkOut, endTime);

  if (
    start &&
    end &&
    end.hours * 60 + end.minutes <= start.hours * 60 + start.minutes
  ) {
    checkOut.setDate(checkOut.getDate() + 1);
  }

  return { checkIn, checkOut };
};

export const isBookingStayActive = (
  input: Parameters<typeof getBookingStayDates>[0],
  now = new Date(),
) => {
  const { checkIn, checkOut } = getBookingStayDates(input);
  return now >= checkIn && now <= checkOut;
};
