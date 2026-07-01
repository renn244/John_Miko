import { GuestCard, GuestDivider } from "@/components/guest";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthContext } from "@/context/AuthContext";
import { useGetClosuresQuery } from "@/hooks/admin/closure.hook";
import { useGetBookingsByAccommodationQuery } from "@/hooks/booking.hook";
import { isSameDateOnly } from "@/lib/date.util";
import { formatStayOptionRange } from "@/lib/stayOptionTime";
import { formatPeso } from "@/lib/utils";
import { useBookingSelectStore } from "@/store/booking/useBookingSelect";
import type { AccommodationStayOption } from "@/types/admin/accommodation.type";
import { ArrowRight, Calendar, Info } from "lucide-react";
import { Link, useNavigate } from "react-router";

type AccommodationSideBookingProps = {
    accommodation: {
        id: string;
        price: number;
        stayOptions: AccommodationStayOption[];
    };
};

const AccommodationSideBooking = ({
    accommodation,
}: AccommodationSideBookingProps) => {
    const navigate = useNavigate();

    const { bookingDate, setBookingDate, bookingType, setStayOption } = useBookingSelectStore();
    const { user } = useAuthContext();

    const { data: bookedDates } = useGetBookingsByAccommodationQuery(accommodation.id);
    const { data: closureDates } = useGetClosuresQuery("withGlobal", accommodation.id);

    const selectedDateBookingData = bookingDate
        ? bookedDates?.find((bookingData) => isSameDateOnly(bookingDate, new Date(bookingData.bookingDate)))
        : undefined;

    const activeStayOptions = accommodation.stayOptions.filter((stayOption) => stayOption.isActive);
    const isStayOptionAvailable = (stayOptionId: string) => {
        return !selectedDateBookingData?.timeSlotsOccupied.includes(stayOptionId);
    };

    const partialBookedDates =
        bookedDates?.filter((bookingData) => bookingData.bookingStatus === "Partial").map((bookingData) => new Date(bookingData.bookingDate)) || [];
    const fullyBookedDates =
        bookedDates?.filter((bookingData) => bookingData.bookingStatus === "Full").map((bookingData) => new Date(bookingData.bookingDate)) || [];
    const closedDates = closureDates?.map((closure) => new Date(closure.date)) || [];

    return (
        <GuestCard className="rounded-lg p-4 shadow-sm">
            <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold">
                        {formatPeso(accommodation.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">/stay</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">Ready to book this stay?</p>
            </div>

            <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide">
                    Select Visit Date
                </p>
                <CalendarComponent
                    className="w-full rounded-lg border p-2"
                    mode="single"
                    selected={bookingDate}
                    onSelect={(date) => {
                        setBookingDate(date);
                    }}
                    disabled={[
                        { before: new Date() },
                        ...fullyBookedDates,
                        ...closedDates,
                    ]}
                    modifiers={{
                        partialBooked: partialBookedDates,
                        fullyBooked: fullyBookedDates,
                        closedDates: closedDates,
                    }}
                    modifiersClassNames={{
                        partialBooked: "[&>button]:bg-yellow-400 [&>button]:bg-opacity-30 text-white",
                        fullyBooked: "[&>button]:bg-red-700 text-white pointer-events-none ",
                        closedDates: "[&>button]:bg-red-700 text-white pointer-events-none",
                    }}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                    Select a date to check available stay options.
                </p>
            </div>

            <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide">
                    Available Stay Options
                </p>
                {bookingDate ? (
                    <RadioGroup
                        value={bookingType || ""}
                        onValueChange={(value) => {
                            const selectedStayOption = activeStayOptions.find((stayOption) => stayOption.id === value);
                            setStayOption(selectedStayOption);
                        }}
                        className="gap-2"
                    >
                        {activeStayOptions
                            .filter((stayOption) => isStayOptionAvailable(stayOption.id))
                            .map((stayOption) => (
                                <FieldLabel key={stayOption.id} htmlFor={stayOption.id}>
                                    <Field orientation="horizontal" className="items-center">
                                        <FieldContent>
                                            <FieldTitle>{stayOption.label}</FieldTitle>
                                            <FieldDescription>
                                                {formatStayOptionRange(stayOption)}
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value={stayOption.id} id={stayOption.id} />
                                    </Field>
                                </FieldLabel>
                            ))}
                    </RadioGroup>
                ) : (
                    <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                        Choose a visit date first.
                    </div>
                )}

                {bookingDate && activeStayOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No stay options are currently available for this accommodation.
                    </p>
                ) : null}
            </div>

            <div className="mt-4 space-y-2">
                {user ? (
                    <Button
                        onClick={() => navigate(`/booking/${accommodation.id}`)}
                        disabled={!bookingDate || !bookingType}
                        className="w-full"
                        size="lg"
                    >
                        Book Now
                        <ArrowRight className="size-4" />
                    </Button>
                ) : (
                    <Button asChild className="w-full" size="lg">
                        <Link to="/login">Login to Book</Link>
                    </Button>
                )}
                <Button asChild variant="ghost" className="w-full">
                    <Link to="/accommodation">Back to Accommodations</Link>
                </Button>
            </div>

            <GuestDivider className="my-4" />

            <div className="flex gap-3 rounded-md border bg-muted/30 p-3">
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-xs leading-5 text-muted-foreground">
                    <p>Food pre-orders and optional services are selected during booking.</p>
                    <p>Final pricing is shown before payment.</p>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                50% down payment is required to confirm your reservation.
            </div>
        </GuestCard>
    );
};

export default AccommodationSideBooking;
