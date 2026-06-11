import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthContext } from "@/context/AuthContext";
import { useGetClosuresQuery } from "@/hooks/admin/closure.hook";
import { useGetBookingsByAccommodationQuery } from "@/hooks/booking.hook";
import { isSameDateOnly } from "@/lib/date.util";
import { formatStayOptionRange } from "@/lib/stayOptionTime";
import { useBookingSelectStore } from "@/store/booking/useBookingSelect";
import type { AccommodationStayOption } from "@/types/admin/accommodation.type";
import {
    Calendar
} from 'lucide-react';
import { Link, useNavigate } from "react-router";

type AccommodationSideBookingProps = {
    accommodation: {
        id: string;
        price: number;
        stayOptions: AccommodationStayOption[];
    },
}

const AccommodationSideBooking = ({
    accommodation,
}: AccommodationSideBookingProps) => {
    const navigate = useNavigate();

    const { bookingDate, setBookingDate, bookingType, setStayOption } = useBookingSelectStore();
    const { user } = useAuthContext();

    const { data: bookedDates } = useGetBookingsByAccommodationQuery(accommodation.id);
    const { data: closureDates } = useGetClosuresQuery('withGlobal', accommodation.id);

    const selectedDateBookingData = bookingDate ? bookedDates?.find((bookingData) => isSameDateOnly(bookingDate, new Date(bookingData.bookingDate))) : undefined;

    const activeStayOptions = accommodation.stayOptions.filter((stayOption) => stayOption.isActive);
    const isStayOptionAvailable = (stayOptionId: string) => {
        return !selectedDateBookingData?.timeSlotsOccupied.includes(stayOptionId);
    }

    const partialBookedDates = bookedDates?.filter((bookingData) => bookingData.bookingStatus === 'Partial').map((bookingData) => new Date(bookingData.bookingDate)) || [];
    const fullyBookedDates = bookedDates?.filter((bookingData) => bookingData.bookingStatus === 'Full').map((bookingData) => new Date(bookingData.bookingDate)) || [];
    const closedDates = closureDates?.map((closure) => new Date(closure.date)) || [];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2">

            <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-primary">
                        ₱{accommodation.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        / stay
                    </span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Plus applicable taxes and fees
                </p>
            </div>

            <CalendarComponent 
            className="w-full sm:w-auto mb-4 border rounded-xl"
            mode="single"
            selected={bookingDate}
            onSelect={(date) => {
                setBookingDate(date);
            }}
            disabled={[
                { before: new Date() },
                ...fullyBookedDates,
                ...closedDates
            ]}
            modifiers={{
                partialBooked: partialBookedDates,
                fullyBooked: fullyBookedDates,
                closedDates: closedDates
            }}
            modifiersClassNames={{
                partialBooked: '[&>button]:bg-yellow-400 [&>button]:bg-opacity-30 text-white',
                fullyBooked: '[&>button]:bg-red-700 text-white pointer-events-none ',  
                closedDates: '[&>button]:bg-red-700 text-white pointer-events-none'
            }}
            />
            
            {bookingDate && (
                <div className="rounded-xl mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-sm">
                            Check-in & Check-out
                        </span>
                    </div>
                        <RadioGroup
                        value={bookingType || ''}
                        onValueChange={(value) => {
                            const selectedStayOption = activeStayOptions.find((stayOption) => stayOption.id === value);
                            setStayOption(selectedStayOption);
                        }}
                        >
                            {activeStayOptions.filter((stayOption) => isStayOptionAvailable(stayOption.id)).map((stayOption) => (
                                <FieldLabel key={stayOption.id} htmlFor={stayOption.id}>
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>{stayOption.label}</FieldTitle>
                                            <FieldDescription>
                                                {formatStayOptionRange(stayOption)}
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem 
                                        value={stayOption.id} id={stayOption.id} />
                                    </Field>
                                </FieldLabel>
                            ))}
                        </RadioGroup>

                        {activeStayOptions.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No stay options are currently available for this accommodation.
                            </p>
                        )}
                </div>
            )}

            {user ? (
                <Button 
                onClick={() => navigate(`/booking/${accommodation.id}`)}
                disabled={!bookingDate || !bookingType}
                className="w-full">
                    <Calendar className="w-6 h-6" />
                    Book Now
                </Button>
            ) : (
                <Link to={'/login'}>
                    <Button className="w-full">
                        Login
                    </Button>
                </Link>
            )}
        </div>
    )
}

export default AccommodationSideBooking
