import { Button } from "@/components/ui/button";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { ArrowRight } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type ReviewFormProps = {
    accommodation: Accommodation,
    setBookingStep: Dispatch<SetStateAction<'form' | 'review' | 'pre-order' | 'payment'>>,
    stayType: 'OverNight' | 'DayStay',
    checkIn: Date,
    checkOut: Date,
    price: number,
    preOrderSubTotal: number,
    serviceFee?: number,
    total: number,
}

const ReviewForm = ({ 
    accommodation, stayType, checkIn, checkOut, price, preOrderSubTotal, serviceFee, total, setBookingStep 
}: ReviewFormProps) => {
    const { watch } = useFormContext<multiStepBookingFormSchema>();

    return (
        <div className="space-y-6">
            <div className="space-y-4">

                <h3 className="font-bold text-lg">
                    Booking Summary
                </h3>

                <div className="p-3 rounded-xl border-2">
                    <div className="flex gap-4">
                        <img
                        src={'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200'}
                        alt={accommodation.name}
                        className="w-20 h-20 rounded-md object-cover"
                        />
                        <div className="flex-1">
                            <h4 className="font-bold mb-1">
                                {accommodation.name}
                            </h4>
                            <p className="text-sm mb-2 text-muted-foreground">
                                {accommodation.type}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{accommodation.capacity} Guests</span>
                                <span>{accommodation.type} Type</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 px-3 rounded-md bg-muted">
                        <span className="text-muted-foreground text-sm">Stay Type:</span>
                        <span className="font-medium text-sm">
                            {stayType === 'OverNight' ? 'Over Night' : 'Day Stay'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 px-3 rounded-md bg-muted">
                        <span className="text-muted-foreground text-sm">Check-in:</span>
                        <span className="font-medium text-sm">
                            {checkIn.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                minute: '2-digit',
                                hour: '2-digit',
                                hour12: true,
                            })}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 px-3 rounded-md bg-muted">
                        <span className="text-muted-foreground text-sm">Check-out:</span>
                        <span className="font-medium text-sm">
                            {checkOut.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                minute: '2-digit',
                                hour: '2-digit',
                                hour12: true,
                            })}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 px-3 rounded-md bg-muted">
                        <span className="text-muted-foreground text-sm">Number of Guests:</span>
                        <span className="font-medium text-sm">
                            {watch('numberOfGuests')} {watch('numberOfGuests') === 1 ? 'Guest' : 'Guests'}
                        </span>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-2">
                        Guest Information
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">
                                {watch('firstName')} {watch('lastName')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-semibold">
                                {watch('email')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-semibold">
                                {watch('contactNo')}
                            </span>
                        </div>
                        {watch('specialRequest') && (
                            <div className="pt-2 border-t">
                                <span className="block mb-1 text-muted-foreground">
                                    Special Request:
                                </span>
                                <span className="font-medium">
                                    {watch('specialRequest')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-primary/75 bg-primary/5">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {stayType === 'OverNight' ? 'Overnight Rate' : 'Day Stay Rate'}
                            </span>
                            <span className="font-semibold">
                                ₱{price.toLocaleString()}
                            </span>
                        </div>
                        {serviceFee && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Service Fee</span>
                                <span className="font-semibold">
                                    ₱{serviceFee.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {preOrderSubTotal > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Pre-Order Subtotal</span>
                                <span className="font-semibold">
                                    ₱{preOrderSubTotal.toLocaleString()}
                                </span>
                            </div>
                        )}
                        <div className="pt-2 border-t flex justify-between">
                            <span className="font-bold text-lg">
                                Total
                            </span>
                            <span className="font-bold text-lg text-primary">
                                ₱ {total.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Button
                type="button"
                className="w-full"
                onClick={() => setBookingStep('payment')}
                >
                    Proceed to Payment
                    <ArrowRight className="w-6 h-6" />
                </Button>
                <Button type="button" variant="outline" className="w-full"
                onClick={() => setBookingStep('pre-order')}
                >
                    Back to Pre-order
                </Button>
            </div>
        </div>
    )
}

export default ReviewForm;