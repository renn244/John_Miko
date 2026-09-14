import { useGetClosureForBookingQuery } from "@/features/admin/closures/hooks/useClosureAdmin";
import { useGetClosuresQuery } from "@/features/shared/closures/hooks/useClosureAvailability";
import type { ComponentProps } from "react";
import { Calendar } from "@/components/ui/calendar";

type ClosureAvailabilityCalendarProps = {
    className?: string;
    accommodationId?: string;
    closedDates?: Date[];
} & ComponentProps<typeof Calendar>

const ClosureAvailabilityCalendar = ({
    className, accommodationId, closedDates, ...props
}: ClosureAvailabilityCalendarProps) => {
    const { data: bookedDates } = useGetClosureForBookingQuery(accommodationId);
    const bookedDatesOnly = bookedDates?.map((bookingData) => new Date(bookingData.bookingDate)) || [];

    const { data: closureDates } = useGetClosuresQuery('withGlobal' ,accommodationId);
    const closedDatesOnly = closureDates?.map((closureData) => new Date(closureData.date)) || [];

    return (
        <Calendar 
        className={className}
        mode="single"
        disabled={[
            { before: new Date() },
            ...(closedDates ?? []),
            ...bookedDatesOnly,
            ...closedDatesOnly
        ]}
        modifiers={{
            bookedDates: bookedDatesOnly,
            closedDates: closedDatesOnly
        }}
        modifiersClassNames={{
            bookedDates: "[&>button]:bg-yellow-400 text-white cursor-pointer",
            closedDates: "[&>button]:bg-destructive text-white cursor-pointer"
        }}
        {...props}
        />
    )
}

export default ClosureAvailabilityCalendar
