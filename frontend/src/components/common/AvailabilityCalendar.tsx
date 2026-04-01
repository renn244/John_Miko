import { useGetBookingsByAccommodationQuery } from "@/hooks/booking.hook";
import type { ComponentProps } from "react";
import { Calendar } from "../ui/calendar";

type AvailabilityCalendarProps = {
    className?: string;
    accommodationId: string;
    disabledDates?: Date[];
    partialBookedDates?: Date[];
    fullyBookedDates?: Date[];
} & ComponentProps<typeof Calendar>

const AvailabilityCalendar = ({ className, accommodationId, ...props }: AvailabilityCalendarProps) => {
    const { data: bookedDates } = useGetBookingsByAccommodationQuery(accommodationId);
    
    const partialBookedDates = bookedDates?.filter((bookingData) => bookingData.bookingStatus === 'Partial').map((bookingData) => new Date(bookingData.bookingDate)) || [];
    const fullyBookedDates = bookedDates?.filter((bookingData) => bookingData.bookingStatus === 'Full').map((bookingData) => new Date(bookingData.bookingDate)) || [];

    return (
        <Calendar 
        className={className}
        mode="single"
        disabled={[
            { before: new Date() },
            ...fullyBookedDates
        ]}
        modifiers={{
            partialBooked: partialBookedDates,
            fullyBooked: fullyBookedDates
        }}
        modifiersClassNames={{
            partialBooked: '[&>button]:bg-yellow-400 [&>button]:bg-opacity-30 text-white',
            fullyBooked: '[&>button]:bg-red-700 text-white pointer-events-none ',  
        }}
        {...props}
        />
    )
}

export default AvailabilityCalendar