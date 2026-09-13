import { useGetClosuresQuery } from "@/features/shared/closures/hooks/useClosureAvailability";
import type { ComponentProps } from "react";
import { Calendar } from "@/components/ui/calendar";

type DeleteClosureAvailabilityCalendarProps = {
    className?: string;
    accommodationId?: string;
} & ComponentProps<typeof Calendar>;

const DeleteClosureAvailabilityCalendar = ({
    className, accommodationId, ...props
}: DeleteClosureAvailabilityCalendarProps) => {
    const { data: closureDates } = useGetClosuresQuery('specific', accommodationId);
    const closedDatesOnly = closureDates?.map((closureData) => new Date(closureData.date)) || [];

    return (
        <Calendar 
        className={className}
        mode="single"
        disabled={[
            (date) => {
                const isClosed = closedDatesOnly.some(d => d.toDateString() === date.toDateString());
                
                return !isClosed || date < new Date(); // disable past dates and non closed dates
            }
        ]}
        modifiers={{
            closedDates: closedDatesOnly
        }}
        modifiersClassNames={{
            closedDates: "[&>button]:bg-destructive text-white cursor-pointer"
        }}
        {...props}
        />
    )
}

export default DeleteClosureAvailabilityCalendar
