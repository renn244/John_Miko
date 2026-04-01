import { useGetBookingsByAccommodationQuery } from "@/hooks/booking.hook";
import { isSameDateOnly } from "@/lib/date.util";
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

    const selectedDateBookingData = checkInDate ? bookedDates?.find((bookingData) => isSameDateOnly(checkInDate, new Date(bookingData.bookingDate))) : undefined;

    const isDayStayAvailable = !selectedDateBookingData?.timeSlotsOccupied.includes("DayStay");
    const isOverNightAvailable = !selectedDateBookingData?.timeSlotsOccupied.includes("OverNight");

    return (
        <RadioGroup
        aria-invalid={invalid}
        className={cn("grid md:grid-cols-2 gap-3", className)}
        {...props}
        >
            {isDayStayAvailable && (
                <FieldLabel htmlFor="form-rhf-radiogroup-DayStay">
                    <Field orientation="horizontal" data-invalid={invalid}>
                        <FieldContent>
                            <FieldTitle>
                                DayStay
                            </FieldTitle>
                            <FieldDescription>
                                12:00 PM to 1:00 AM
                            </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                        value="DayStay"
                        id={`form-rhf-radiogroup-DayStay`}
                        aria-invalid={invalid}
                        />
                    </Field>
                </FieldLabel>
            )}
            {isOverNightAvailable && (
                <FieldLabel htmlFor="form-rhf-radiogroup-OverNight">
                    <Field orientation="horizontal" data-invalid={invalid}>
                        <FieldContent>
                            <FieldTitle>
                                OverNight
                            </FieldTitle>
                            <FieldDescription>
                                1:00 AM to 11:00 PM
                            </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                        value="OverNight"
                        id={`form-rhf-radiogroup-OverNight`}
                        aria-invalid={invalid}
                        />
                    </Field>
                </FieldLabel>
            )}
        </RadioGroup>
    )
}

export default AvailabilityStayType