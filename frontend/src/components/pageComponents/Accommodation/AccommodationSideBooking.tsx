import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetBookingsByAccommodationQuery } from "@/hooks/booking.hook";
import { isSameDateOnly } from "@/lib/date.util";
import { useBookingSelectStore } from "@/store/booking/useBookingSelect";
import {
    Calendar,
    CheckCircle
} from 'lucide-react';

type AccommodationSideBookingProps = {
    accommodation: {
        id: string;
        price: number;
    },
    setIsOpen: (isOpen: boolean) => void
}

const AccommodationSideBooking = ({
    accommodation,
    setIsOpen
}: AccommodationSideBookingProps) => {
    const { bookingDate, setBookingDate, bookingType, setBookingType } = useBookingSelectStore();

    const { data: bookedDates } = useGetBookingsByAccommodationQuery(accommodation.id);
    
    const selectedDateBookingData = bookingDate ? bookedDates?.find((bookingData) => isSameDateOnly(bookingDate, new Date(bookingData.bookingDate))) : undefined;

    const isDayStayAvailable = !selectedDateBookingData?.timeSlotsOccupied.includes("DayStay");
    const isOverNightAvailable = !selectedDateBookingData?.timeSlotsOccupied.includes("OverNight");

    const partialBookedDates = bookedDates?.filter((bookingData) => bookingData.bookingStatus === 'Partial').map((bookingData) => new Date(bookingData.bookingDate)) || [];
    const fullyBookedDates = bookedDates?.filter((bookingData) => bookingData.bookingStatus === 'Full').map((bookingData) => new Date(bookingData.bookingDate)) || [];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2">

            <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-primary">
                        ₱{accommodation.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        / night or day
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
            />
            
            {bookingDate && (
                <div className="rounded-xl mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-sm">
                            Check-in & Check-out
                        </span>
                    </div>
                        <RadioGroup value={bookingType || ''} onValueChange={(value) => setBookingType(value as 'OverNight' | 'DayStay')}>
                            {isDayStayAvailable && (
                                <FieldLabel htmlFor="DayStay">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Day Stay</FieldTitle>
                                            <FieldDescription>
                                                12:00 PM to 1:00 AM
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem 
                                        value="DayStay" id="DayStay" />
                                    </Field>
                                </FieldLabel>
                            )}

                            {isOverNightAvailable && (
                                <FieldLabel htmlFor="OverNight">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Over Night</FieldTitle>
                                            <FieldDescription>
                                                1:00 AM to 11:00 PM
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem 
                                    value="OverNight" id="OverNight" 
                                    /> 
                                </Field>
                            </FieldLabel>
                            )}
                        </RadioGroup>
                </div>
            )}

            <Button 
            onClick={() => setIsOpen(true)}
            disabled={!bookingDate || !bookingType}
            className="w-full">
                <Calendar className="w-6 h-6" />
                Book Now
            </Button>

            <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-700" />
                    <span className="text-sm text-muted-foreground">
                        Free cancellation up to 48 hours
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-700" />
                    <span className="text-sm text-muted-foreground">
                        Best price guarantee
                    </span>
                </div> 
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-700" />
                    <span className="text-sm text-muted-foreground">
                        Instant booking confirmation
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AccommodationSideBooking