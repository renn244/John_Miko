import { useCreateBookingMutation } from "@/features/public/bookings/hooks/useGuestBookings";
import { toDateOnly } from "@/lib/date.util";
import { getBookingDates } from "@/lib/getBookingDates";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { useBookingSelectStore } from "@/features/public/bookings/store/bookingSelect.store";
import type { Accommodation } from "@/features/shared/accommodations/types/accommodation.type";
import type { BookingWithPaymentInfo } from "@/features/shared/bookings/types/booking.type";
import { useGetMenuItemsBulkQuery } from "@/features/shared/menu-items/hooks/useMenuItemQueries";
import { useMemo, useState } from "react";
import { useFormContext, useWatch, type FieldPath } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import AddOnServiceForm from "./AddOnServiceForm";
import BookingConfirmation, { type BookingConfirmationSummary } from "./BookingConfirmation";
import GuestForm from "./GuestForm";
import PaymentForm from "./PaymentForm";
import PreOrderForm from "./PreOrderForm";
import ReviewForm from "./ReviewForm";

export type BookingStep = 'form' | 'add-on' | 'review' | 'pre-order' | 'payment';

type MultiStepBookingFormProps = {
    accommodation: Accommodation,
    bookingStep: BookingStep,
    setBookingStep: React.Dispatch<React.SetStateAction<BookingStep>>,
    clearDraft: () => void,
    onSuccess?: () => void;
}

// We are makinga multi-step form, because later on it will have more step like pre order and other things.
const CHILD_REQUIRES_ADULT_MESSAGE = "At least 1 adult is required when booking for kids";

const GuestCountSchema = z.object({
    adultGuests: z.number().optional(),
    kidGuests: z.number().optional(),
}).superRefine((data, context) => {
    if ((data.kidGuests ?? 0) > 0 && (data.adultGuests ?? 0) < 1) {
        context.addIssue({
            code: "custom",
            path: ["adultGuests"],
            message: CHILD_REQUIRES_ADULT_MESSAGE,
        });
    }
});

export const MultiStepBookingFormSchema = z.object({
    // Step 1 - Guest Information
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.email().nonempty("Email is required"),
    contactNo: z.string().nonempty("Phone number is required").regex(/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits"),
    
    adultGuests: z.number().optional(),
    seniorGuests: z.number().optional(),
    kidGuests: z.number().optional(),
    numberOfGuests: z.number().min(1, "At least 1 guest"),
    
    specialRequest: z.string().optional(),

    // Step 2 - Review (No additional fields, just confirmation)
    stayOptionId: z.string().nonempty("Stay option is required"),
    checkIn: z.date("Check-in date is required"),

    // Step 3 - Pre-order (No additional fields, just confirmation)
    preOrderItems: z.array(
        z.object({
            menuItemId: z.string(),
            quantity: z.number().min(1, "Quantity must be at least 1"),
        })
    ),

    // Step 3 (new) - Add-on services
    addOnServices: z.array(
        z.object({
            addOnServiceId: z.string(),
            quantity: z.number().min(1, "Quantity must be at least 1"),
            // snapshots for review UI (not required by backend)
            name: z.string().optional(),
            price: z.number().optional(),
            imageUrl: z.string().optional(),
        })
    ),

    // Step 4 - Payment
    paymentType: z.enum(['Full', 'Partial'], { error: "Please choose a payment type" }),
    paymentMethodId: z.string().nonempty("Payment method is required"),
    proofImageUrl: z.url({ error: "Please upload your proof of payment" }),
    validIdImageUrl: z.url({ error: "Please upload a valid ID" }),
})

export type multiStepBookingFormSchema = z.infer<typeof MultiStepBookingFormSchema>;

const BOOKING_STEP_FIELDS: Record<BookingStep, FieldPath<multiStepBookingFormSchema>[]> = {
    form: ["firstName", "lastName", "email", "contactNo", "adultGuests", "seniorGuests", "kidGuests", "numberOfGuests"],
    "add-on": ["addOnServices"],
    "pre-order": ["preOrderItems"],
    review: [],
    payment: ["paymentType", "paymentMethodId", "proofImageUrl", "validIdImageUrl"],
};

const MultiStepBookingForm = ({ 
    accommodation, bookingStep, setBookingStep, clearDraft, onSuccess
}: MultiStepBookingFormProps) => {
    const [confirmation, setConfirmation] = useState<{
        booking: BookingWithPaymentInfo;
        summary: BookingConfirmationSummary;
    } | null>(null);
    const [attemptedSteps, setAttemptedSteps] = useState<Record<BookingStep, boolean>>({
        form: false,
        "add-on": false,
        "pre-order": false,
        review: false,
        payment: false,
    });

    const navigate = useNavigate();    
    const stayOption = useBookingSelectStore((state) => state.stayOption);
    const checkIn = useBookingSelectStore((state) => state.bookingDate!);
    const resetBookingSelection = useBookingSelectStore((state) => state.reset);

    const navigateAfterConfirmation = (destination: string) => {
        // Commit the destination before clearing selection: the mounted Booking
        // page redirects to Accommodation whenever its selection is missing.
        clearDraft();
        navigate(destination, { replace: true, flushSync: true });
        resetBookingSelection();
    };

    const form = useFormContext<multiStepBookingFormSchema>();

    const { mutateAsync, isPending } = useCreateBookingMutation();

    const markStepAttempted = (step: BookingStep) => {
        setAttemptedSteps((current) => current[step] ? current : { ...current, [step]: true });
    };

    const validateBookingStep = async (step: BookingStep) => {
        markStepAttempted(step);
        const fields = BOOKING_STEP_FIELDS[step];

        const isStepValid = fields.length === 0 || await form.trigger(fields, { shouldFocus: true });

        if (step !== 'form') return isStepValid;

        const isGuestCountValid = GuestCountSchema.safeParse({
            adultGuests: form.getValues('adultGuests'),
            kidGuests: form.getValues('kidGuests'),
        }).success;

        if (isGuestCountValid) {
            form.clearErrors('adultGuests');
            return isStepValid;
        }

        form.setError('adultGuests', {
            type: 'manual',
            message: CHILD_REQUIRES_ADULT_MESSAGE,
        });

        if (isStepValid) form.setFocus('adultGuests');
        return false;
    };

    const onSubmit = async (data: multiStepBookingFormSchema) => {
        const { firstName, lastName, checkIn, addOnServices, ...rest } = data;

        const addOnServicesPayload = (addOnServices || []).map((s) => ({
            addOnServiceId: s.addOnServiceId,
            quantity: s.quantity,
        }));

        try {
            const response = await mutateAsync({
                accommodationId: accommodation.id,
                name: `${firstName} ${lastName}`,
                checkIn: toDateOnly(checkIn),
                addOnServices: addOnServicesPayload,
                ...rest
            })

            const paidNow = data.paymentType === 'Full' ? total : Math.round(total / 2);
            const amountToPayLater = total - paidNow;

            setConfirmation({
                booking: response,
                summary: {
                    guestName: `${firstName} ${lastName}`,
                    email: data.email,
                    contactNo: data.contactNo,
                    stayType: stayOption?.label || "Stay",
                    checkIn: bookingCheckIn,
                    checkOut: bookingCheckOut,
                    paymentType: data.paymentType,
                    total,
                    amountPaid: paidNow,
                    amountToPayLater,
                }
            })

            onSuccess?.();
            toast.success('Payment proof and valid ID submitted. We will verify shortly.');
        } catch (error: unknown) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, form.setError);
                return
            }

            toast.error(error instanceof Error ? error.message : 'Failed to create booking')
        }
    }

    const submitPayment = async () => {
        if (!await validateBookingStep('payment')) return;

        await form.handleSubmit(onSubmit, () => markStepAttempted('payment'))();
    };

    const adultFee = stayOption?.code.toLowerCase() === 'daystay' ? 150 : 180; // full price
    const seniorFee = adultFee - (adultFee * 0.20); // 20 percent discount
    const kidsFee = 100 // just a kid 4-7 years old

    const adultCount = useWatch({ control: form.control, name: 'adultGuests' }) || 0;
    const kidsCount = useWatch({ control: form.control, name: 'kidGuests' }) || 0;
    const seniorCount = useWatch({ control: form.control, name: 'seniorGuests' }) || 0;
    const addOnServices = useWatch({ control: form.control, name: 'addOnServices' });
    const preOrderItems = useWatch({ control: form.control, name: 'preOrderItems' });
    const { data: selectedMenuItems } = useGetMenuItemsBulkQuery(preOrderItems?.map((item) => item.menuItemId));


    const { totalGuestFee } = useMemo(() => {
        const totalGuestFee = accommodation.isGuestFeeWaived
            ? 0
            : (adultCount * adultFee) + (seniorCount * seniorFee) + (kidsCount * kidsFee);

        return { totalGuestFee };
    }, [accommodation.isGuestFeeWaived, adultCount, adultFee, kidsCount, seniorCount, seniorFee])

    const { checkIn: bookingCheckIn, checkOut: bookingCheckOut } = getBookingDates(checkIn, stayOption);

    const addOnTotal = useMemo(
        () => (addOnServices ?? []).reduce((total, service) => total + (service.price ?? 0) * service.quantity, 0),
        [addOnServices],
    );
    const preOrderTotal = useMemo(
        () => (preOrderItems ?? []).reduce((total, item) => {
            const menuItem = selectedMenuItems?.find((menu) => menu.id === item.menuItemId);
            return total + (menuItem?.price ?? 0) * item.quantity;
        }, 0),
        [preOrderItems, selectedMenuItems],
    );
    const total = accommodation.price + addOnTotal + preOrderTotal + totalGuestFee;

    if(confirmation) {
        return (
            <BookingConfirmation
            viewMyBookings={() => {
                navigateAfterConfirmation('/my-bookings');
            }}
            backToHome={() => {
                navigateAfterConfirmation('/');
            }}
            accommodation={accommodation}
            booking={confirmation.booking}
            summary={confirmation.summary}
            />
        )
    }

    return (  
            <form className="pb-8">
                {bookingStep === 'form' && (
                    <GuestForm
                    accommodation={accommodation}
                    selectedStayType={stayOption?.label || "Stay"}
                    selectedStayCode={stayOption?.code}
                    selectedCheckIn={bookingCheckIn}
                    selectedCheckOut={bookingCheckOut}
                    setBookingStep={setBookingStep}
                    isValidationActive={attemptedSteps.form}
                    validateStep={() => validateBookingStep('form')}
                    />
                )}

                {bookingStep === 'add-on' && (
                    <AddOnServiceForm
                        setBookingStep={setBookingStep}
                    />
                )}

                {bookingStep === 'pre-order' && (
                    <PreOrderForm 
                    setBookingStep={setBookingStep}
                    />
                )}

                {bookingStep === 'review' && (
                    <ReviewForm 
                    accommodation={accommodation}
                    stayType={stayOption?.label || "Stay"}
                    accommodationSubtotal={accommodation.price}
                    addOnSubTotal={addOnTotal}
                    preOrderSubTotal={preOrderTotal}
                    guestFeeSubTotal={totalGuestFee}
                    total={total}
                    setBookingStep={setBookingStep}
                    checkIn={bookingCheckIn}
                    checkOut={bookingCheckOut}
                    />
                )}

                {bookingStep === 'payment' && (
                    <PaymentForm 
                    setBookingStep={setBookingStep}
                    total={total}
                    isLoading={isPending}
                    isValidationActive={attemptedSteps.payment}
                    submitPayment={submitPayment}
                    />
                )}
            </form>
    )
}

export default MultiStepBookingForm
