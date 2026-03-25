import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { ArrowRight, CheckCircle, Info, X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

type AccommodationBookingModalProps = {
    accommodation: Accommodation,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}

const AccommodationBookingModal = ({ accommodation, isOpen, setIsOpen }: AccommodationBookingModalProps) => {
    const [bookingStep, setBookingStep] = useState<'form' | 'review' | 'payment'>('form');
    
    const handleClose = () => {
        setIsOpen(false);
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-full max-w-xl sm:max-w-2xl gap-0">

                <div
                className="sticky top-0 bg-white z-10 p-6 border-b flex items-center justify-between"
                style={{ borderColor: '#E5E7EB' }}
                >
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
                            {bookingStep === 'form' && 'Guest Information'}
                            {bookingStep === 'review' && 'Review Booking'}
                            {bookingStep === 'payment' && 'Payment'}
                        </h2>
                        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                            {bookingStep === 'form' && 'Step 1 of 3'}
                            {bookingStep === 'review' && 'Step 2 of 3'}
                            {bookingStep === 'payment' && 'Step 3 of 3'}
                        </p>
                    </div>
                    <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6" style={{ color: '#6B7280' }} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {bookingStep === 'form' && (
                        <GuestForm
                        accommodation={accommodation}
                        selectedStayType="overnight"
                        selectedCheckIn={new Date("2024-12-25")}
                        selectedCheckOut={new Date("2024-12-31")}
                        setBookingStep={setBookingStep}
                        />
                    )}

                    {bookingStep === 'review' && (
                        <ReviewForm 
                        accommodation={accommodation}
                        setBookingStep={setBookingStep}
                        />
                    )}

                    {bookingStep === 'payment' && (
                        <PaymentForm 
                        setBookingStep={setBookingStep}
                        />
                    )}

                </div>
            </SheetContent>
        </Sheet>
    )
}

type GuestFormProps = {
    accommodation: Accommodation,
    selectedStayType: 'overnight' | 'day',
    selectedCheckIn: Date | null,
    selectedCheckOut: Date | null,
    setBookingStep: Dispatch<SetStateAction<'form' | 'review' | 'payment'>>,
}

const GuestForm =  ({ accommodation, selectedStayType, selectedCheckIn, selectedCheckOut, setBookingStep }: GuestFormProps) => {

    return (
        <div className="space-y-6">

            <div className="p-2 rounded-md bg-muted">
                <h3 className="font-bold mb-3">
                    Your Selection
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Accommodation:</span>
                        <span className="font-semibold">
                            {accommodation.name}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Stay Type:</span>
                        <span className="font-semibold">
                            {selectedStayType === 'overnight' ? 'Over Night' : 'Day Stay'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-in:</span>
                        <span className="font-semibold">
                            {selectedCheckIn?.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out:</span>
                        <span className="font-semibold">
                            {selectedCheckOut?.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-lg" style={{ color: '#1F2937' }}>
                    Personal Information
                </h3>

                <div className="grid gap-2">
                    <Label className="gap-1">
                        First Name<span className="text-red-700">*</span>
                    </Label>
                    <Input
                    type="text"
                    placeholder="Juan"
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="gap-1">
                        Last Name<span className="text-red-700">*</span>
                    </Label>
                    <Input
                    type="text"
                    placeholder="Dela Cruz"
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="gap-1">
                        Email Address<span className="text-red-700">*</span>
                    </Label>
                    <Input
                    type="email"
                    placeholder="juan@example.com"
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="gap-1">
                        Phone Number<span className="text-red-700">*</span>
                    </Label>
                    <Input placeholder="+639613675611" />
                </div>

                <div className="grid gap-2">
                    <Label className="gap-1">
                        Number of Guests<span className="text-red-700">*</span>
                    </Label>
                    <Input
                    type="number"
                    min="1"
                    max={accommodation.capacity}
                    />

                    <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                        Maximum {accommodation.capacity} guests
                    </p>
                </div>

                <div className="grid gap-2">
                    <Label className="gap-1">
                        Special Requests <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <Textarea
                    className="max-h-30" rows={4}
                    placeholder="Any special requests or notes..."
                    />
                </div>

                <Button className="w-full" onClick={() => setBookingStep('review')}>
                    Continue to Review
                    <ArrowRight className="w-6 h-6" />
                </Button>
            </div>
        </div>
    )
}

type ReviewFormProps = {
    accommodation: Accommodation,
    setBookingStep: Dispatch<SetStateAction<'form' | 'review' | 'payment'>>,
}

const ReviewForm = ({ accommodation, setBookingStep }: ReviewFormProps) => {

    const guestData = {
        name: 'Juan Dela Cruz',
        email: 'juandelacruz@example.com',
        phone: '09613675611',
        numberOfGuests: 2,
        specialRequests: 'Late check-in requested'
    }

    const selectedCheckIn = new Date();
    const selectedCheckOut = new Date();

    const selectedStayType = 'overnight';
    const ServiceFee = 500;
    const Total = 9000;

    return (
        <div className="space-y-6">
            <div className="space-y-4">

                <h3 className="font-bold text-lg" style={{ color: '#1F2937' }}>
                    Booking Summary
                </h3>

                <div
                className="p-3 rounded-xl border-2"
                style={{ borderColor: '#E5E7EB' }}
                >
                    <div className="flex gap-4">
                        <img
                        src={'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200'}
                        alt={accommodation.name}
                        className="w-20 h-20 rounded-md object-cover"
                        />
                        <div className="flex-1">
                            <h4 className="font-bold mb-1" style={{ color: '#1F2937' }}>
                                {accommodation.name}
                            </h4>
                            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                                {accommodation.type}
                            </p>
                            <div className="flex items-center gap-4 text-xs" style={{ color: '#9CA3AF' }}>
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
                            {selectedStayType === 'overnight' ? 'Over Night' : 'Day Stay'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 px-3 rounded-md bg-muted">
                        <span className="text-muted-foreground text-sm">Check-in:</span>
                        <span className="font-medium text-sm">
                            {selectedCheckIn?.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 px-3 rounded-md bg-muted">
                        <span className="text-muted-foreground text-sm">Check-out:</span>
                        <span className="font-medium text-sm" style={{ color: '#1F2937' }}>
                            {selectedCheckOut?.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 px-3 rounded-md bg-muted">
                        <span className="text-muted-foreground text-sm">Number of Guests:</span>
                        <span className="font-medium text-sm" style={{ color: '#1F2937' }}>
                            {guestData.numberOfGuests} {guestData.numberOfGuests === 1 ? 'Guest' : 'Guests'}
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
                                {guestData.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-semibold">
                                {guestData.email}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-semibold">
                                {guestData.phone}
                            </span>
                        </div>
                        {guestData.specialRequests && (
                            <div className="pt-2 border-t">
                                <span className="block mb-1 text-muted-foreground">
                                    Special Requests:
                                </span>
                                <span className="font-medium">
                                    {guestData.specialRequests}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-primary/75 bg-primary/5">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {selectedStayType === 'overnight' ? 'Overnight Rate' : 'Day Stay Rate'}
                            </span>
                            <span className="font-semibold">
                                ₱{accommodation.price.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Service Fee</span>
                            <span className="font-semibold">
                                ₱{ServiceFee.toLocaleString()}
                            </span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                            <span className="font-bold text-lg">
                                Total
                            </span>
                            <span className="font-bold text-lg text-primary">
                                ₱ {Total.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Button
                className="w-full"
                onClick={() => setBookingStep('payment')}
                >
                    Proceed to Payment
                    <ArrowRight className="w-6 h-6" />
                </Button>
                <Button variant="outline" className="w-full"
                onClick={() => setBookingStep('form')}
                >
                    Back to Edit
                </Button>
            </div>
        </div>
    )
}

type PaymentFormProps = {
    setBookingStep: Dispatch<SetStateAction<'form' | 'review' | 'payment'>>,
}

const PaymentForm = ({ setBookingStep }: PaymentFormProps) => {
    const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');

    const Total = 9000;
    const Partial = Total / 2;

    return (
        <div className="space-y-6">
            {/* Remove this later after the payment is implemented */}
            <div
            className="p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: '#FEF3C7' }}
            >
                <Info className="w-5 h-5 shrink-0" style={{ color: '#D97706' }} />
                <p className="text-sm" style={{ color: '#78350F' }}>
                    This is a demo payment page. No actual payment will be processed.
                </p>
            </div>

            <div>
                <h3 className="font-bold text-lg mb-2">
                    Payment Type
                </h3>

                {/* <div className="space-y-2">

                    <button
                    onClick={() => setPaymentType('full')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        paymentType === 'full' ? 'shadow-md' : ''
                    }`}
                    style={{
                        borderColor: paymentType === 'full' ? '#1E73BE' : '#E5E7EB',
                        backgroundColor: paymentType === 'full' ? '#EFF6FF' : '#FFFFFF',
                    }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold" style={{ color: '#1F2937' }}>
                                Full Payment
                            </span>
                            <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentType === 'full' ? 'border-[#1E73BE]' : 'border-gray-300'
                            }`}
                            >
                                {paymentType === 'full' && (
                                    <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: '#1E73BE' }}
                                    />
                                )}
                            </div>
                        </div>

                        <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                            Pay the full amount now
                        </p>

                        <p className="font-bold text-lg" style={{ color: '#059669' }}>
                            ₱{Total.toLocaleString()}
                        </p>
                    </button>

                    <button
                    onClick={() => setPaymentType('partial')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        paymentType === 'partial' ? 'shadow-md' : ''
                    }`}
                    style={{
                        borderColor: paymentType === 'partial' ? '#1E73BE' : '#E5E7EB',
                        backgroundColor: paymentType === 'partial' ? '#EFF6FF' : '#FFFFFF',
                    }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold" style={{ color: '#1F2937' }}>
                                50% Downpayment
                            </span>
                            <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentType === 'partial' ? 'border-[#1E73BE]' : 'border-gray-300'
                            }`}
                            >
                                {paymentType === 'partial' && (
                                    <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: '#1E73BE' }}
                                    />
                                )}
                            </div>
                        </div>

                        <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                            Pay 50% now, remaining balance on check-in
                        </p>

                        <p className="font-bold text-lg" style={{ color: '#F97316' }}>
                            ₱{Partial.toLocaleString()}
                        </p>
                    </button>

                </div> */}

                <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as 'full' | 'partial')}>
                    <FieldLabel htmlFor="full-payment">
                        <Field orientation="horizontal">
                        <FieldContent>
                            <FieldTitle>Plus</FieldTitle>
                            <FieldDescription>
                                For individuals and small teams. <br />
                                <span className="font-semibold text-base text-primary">
                                    ₱{Total.toLocaleString()}
                                </span>
                            </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="full" id="full-payment" />
                        </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="partial-payment">
                        <Field orientation="horizontal">
                        <FieldContent>
                            <FieldTitle>50% Downpayment</FieldTitle>
                            <FieldDescription>
                                Pay 50% now, remaining balance on check-in. <br />
                                <span className="font-semibold text-base text-primary">
                                    ₱{Partial.toLocaleString()}
                                </span>
                            </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="partial" id="partial-payment" />
                        </Field>
                    </FieldLabel>
                </RadioGroup>
            </div>

            <div className="p-4 rounded-xl border-2 border-primary/75 bg-primary/5">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">
                        Amount to Pay Now
                    </span>
                    <span className="font-bold text-xl text-primary">
                        ₱{(paymentType === 'full' ? Total : Partial).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <Button className="w-full">
                    <CheckCircle className="w-6 h-6" />
                    Confirm & Pay
                </Button>
                <Button
                onClick={() => setBookingStep('review')}
                variant="outline" className="w-full"
                >
                    Back to Review
                </Button>
            </div>
        </div>
    )
}

export default AccommodationBookingModal