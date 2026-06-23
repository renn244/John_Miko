type BookingStayWindowInput = {
    bookingDate: Date;
    startTime?: Date | null;
    endTime?: Date | null;
};

export const getBookingStayWindow = ({
    bookingDate,
    startTime,
    endTime,
}: BookingStayWindowInput) => {
    const year = bookingDate.getUTCFullYear();
    const month = bookingDate.getUTCMonth();
    const day = bookingDate.getUTCDate();
    const startHour = startTime?.getUTCHours() ?? 0;
    const startMinute = startTime?.getUTCMinutes() ?? 0;
    const endHour = endTime?.getUTCHours() ?? 23;
    const endMinute = endTime?.getUTCMinutes() ?? 59;
    const isOvernight =
        endHour * 60 + endMinute <= startHour * 60 + startMinute;

    return {
        checkIn: new Date(
            Date.UTC(year, month, day, startHour - 8, startMinute),
        ),
        checkOut: new Date(
            Date.UTC(
                year,
                month,
                day + (isOvernight ? 1 : 0),
                endHour - 8,
                endMinute,
            ),
        ),
    };
};

export const isBookingStayActive = (
    input: BookingStayWindowInput,
    now = new Date(),
) => {
    const { checkIn, checkOut } = getBookingStayWindow(input);
    return now >= checkIn && now <= checkOut;
};

export const doBookingStayWindowsOverlap = (
    first: BookingStayWindowInput,
    second: BookingStayWindowInput,
) => {
    const firstWindow = getBookingStayWindow(first);
    const secondWindow = getBookingStayWindow(second);

    return (
        firstWindow.checkIn < secondWindow.checkOut &&
        secondWindow.checkIn < firstWindow.checkOut
    );
};
