export const RESORT_OPERATIONAL_INFO = {
    operatingHours: [
        {
            label: "Day use",
            checkIn: "8:00 AM",
            checkOut: "5:00 PM",
        },
        {
            label: "Overnight",
            checkIn: "7:00 PM",
            checkOut: "5:00 AM",
        },
    ],
    bookingOptionTypes: [
        "DayStay",
        "Overnight",
        "12 Hours",
        "22 Hours",
    ],
} as const;
