import { useGetAccommodationByIdQuery } from "@/hooks/admin/accommodation.hook";
import { useGetBookingsByAccommodationQuery } from "@/hooks/booking.hook";
import { isSameDateOnly } from "@/lib/date.util";
import { formatStayOptionRange } from "@/lib/stayOptionTime";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type AvailabilityStayTypeProps = {
    checkInDate: Date | undefined;
    accommodationId: string;
    className?: string;
    invalid?: boolean;
} & ComponentProps<typeof RadioGroup>

const AvailabilityStayType = ({ checkInDate, accommodationId, className, invalid, ...props }: AvailabilityStayTypeProps) => {
    const { data: bookedDates } = useGetBookingsByAccommodationQuery(accommodationId);
    const { data: accommodation } = useGetAccommodationByIdQuery(accommodationId);

    const selectedDateBookingData = checkInDate ? bookedDates?.find((bookingData) => isSameDateOnly(checkInDate, new Date(bookingData.bookingDate))) : undefined;

    const stayOptions = accommodation?.stayOptions.filter((stayOption) => stayOption.isActive) || [];
    const availableStayOptions = stayOptions.filter((stayOption) => {
        return !selectedDateBookingData?.timeSlotsOccupied.includes(stayOption.id);
    });

    return (
        <RadioGroup
        aria-invalid={invalid}
        className={cn("grid md:grid-cols-2 gap-3", className)}
        {...props}
        >
            {availableStayOptions.map((stayOption) => (
                <FieldLabel key={stayOption.id} htmlFor={`form-rhf-radiogroup-${stayOption.id}`}>
                    <Field orientation="horizontal" data-invalid={invalid}>
                        <FieldContent>
                            <FieldTitle>
                                {stayOption.label}
                            </FieldTitle>
                            <FieldDescription>
                                {formatStayOptionRange(stayOption)}
                            </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                        value={stayOption.id}
                        id={`form-rhf-radiogroup-${stayOption.id}`}
                        aria-invalid={invalid}
                        />
                    </Field>
                </FieldLabel>
            ))}
        </RadioGroup>
    )
}

export default AvailabilityStayType
