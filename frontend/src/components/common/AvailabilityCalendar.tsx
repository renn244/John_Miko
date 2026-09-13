import { useGetBookingsByAccommodationQuery } from "@/features/shared/bookings/hooks/useBookingAvailability";
import type { ComponentProps } from "react";
import { Calendar } from "../ui/calendar";
import { useGetClosuresQuery } from "@/features/shared/closures/hooks/useClosureAvailability";
import { addDays, startOfDay } from "date-fns";

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

    const { data: closureDates } = useGetClosuresQuery("withGlobal", accommodationId);
    const closedDates = closureDates?.map((closure) => new Date(closure.date)) || [];

    return (
        <Calendar 
        className={className}
        mode="single"
        disabled={[
            { before: startOfDay(addDays(new Date(), 3)) },
            ...fullyBookedDates,
            ...closedDates
        ]}
        modifiers={{
            partialBooked: partialBookedDates,
            fullyBooked: fullyBookedDates,
            closedDates: closedDates,
        }}
        modifiersClassNames={{
            partialBooked: '[&>button]:bg-yellow-400 [&>button]:bg-opacity-30 text-white',
            fullyBooked: '[&>button]:bg-red-700 text-white pointer-events-none ',  
            closedDates: "[&>button]:bg-red-700 text-white pointer-events-none",
        }}
        {...props}
        />
    )
}

export default AvailabilityCalendar
