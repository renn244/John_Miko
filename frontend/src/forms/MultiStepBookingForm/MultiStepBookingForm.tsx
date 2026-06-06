import { useCreateBookingMutation } from "@/hooks/booking.hook";
import { toDateOnly } from "@/lib/date.util";
import { getBookingDates } from "@/lib/getBookingDates";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { useBookingSelectStore } from "@/store/booking/useBookingSelect";
import type { Accommodation } from "@/types/admin/accommodation.type";
import type { BookingWithPaymentInfo } from "@/types/booking.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import AddOnServiceForm from "./AddOnServiceForm";
import BookingConfirmation, { type BookingConfirmationSummary } from "./BookingConfirmation";
import GuestForm from "./GuestForm";
import PaymentForm from "./PaymentForm";
import PreOrderForm from "./PreOrderForm";
import ReviewForm from "./ReviewForm";

type MultiStepBookingFormProps = {
    accommodation: Accommodation,
    bookingStep: 'form' | 'add-on' | 'review' | 'pre-order' | 'payment',
    setBookingStep: React.Dispatch<React.SetStateAction<'form' | 'add-on' | 'review' | 'pre-order' | 'payment'>>,
    onSuccess?: () => void;
}

// We are makinga multi-step form, because later on it will have more step like pre order and other things.
const MultiStepBookingFormSchema = z.object({
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
    stayType: z.enum(['OverNight', 'DayStay']),
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
    paymentType: z.enum(['Full', 'Partial']),
    paymentMethodId: z.string().nonempty("Payment method is required"),
    proofImageUrl: z.url().nonempty("Proof of payment is required"),
})

export type multiStepBookingFormSchema = z.infer<typeof MultiStepBookingFormSchema>;

const MultiStepBookingForm = ({ 
    accommodation, bookingStep, setBookingStep, onSuccess
}: MultiStepBookingFormProps) => {
    const [preOrderTotal, setPreOrderTotal] = useState(0);
    const [addOnTotal, setAddOnTotal] = useState(0);
    const [confirmation, setConfirmation] = useState<{
        booking: BookingWithPaymentInfo;
        summary: BookingConfirmationSummary;
    } | null>(null);

    const navigate = useNavigate();    
    const stayType = useBookingSelectStore((state) => state.bookingType!);
    const checkIn = useBookingSelectStore((state) => state.bookingDate!);
    const reset = useBookingSelectStore((state) => state.reset);

    if(!stayType || !checkIn) {
        navigate(`/accommodation/${accommodation.id}`)
    }

    const form = useForm<multiStepBookingFormSchema>({
        resolver: zodResolver(MultiStepBookingFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            contactNo: '',
            adultGuests: 0,
            seniorGuests: 0,
            kidGuests: 0,
            numberOfGuests: 1,
            specialRequest: '',
            stayType: stayType,
            checkIn: checkIn,
            preOrderItems: [],
            addOnServices: [],
            paymentType: undefined,
            paymentMethodId: '',
            proofImageUrl: '',
        },
        criteriaMode: "all"
    })

    const { mutateAsync, isPending } = useCreateBookingMutation();

    const onSubmit = async (data: multiStepBookingFormSchema) => {
        const { firstName, lastName, checkIn, addOnServices, ...rest } = data;

        const addOnServicesPayload = (addOnServices || []).map((s) => ({
            addOnServiceId: s.addOnServiceId,
            quantity: s.quantity,
        }));

        try {
            const response = await mutateAsync({
                accommodationId: accommodation.id,
                name: `${data.firstName} ${data.lastName}`,
                checkIn: toDateOnly(checkIn),
                addOnServices: addOnServicesPayload,
                ...rest
            })

            const paidNow = data.paymentType === 'Full' ? total : Math.round(total / 2);
            const amountToPayLater = total - paidNow;

            setConfirmation({
                booking: response,
                summary: {
                    guestName: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    contactNo: data.contactNo,
                    stayType: stayType,
                    checkIn: bookingCheckIn,
                    checkOut: bookingCheckOut,
                    paymentType: data.paymentType,
                    total,
                    amountPaid: paidNow,
                    amountToPayLater,
                }
            })

            onSuccess?.();
            toast.success('Payment proof submitted. We will verify shortly.');
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, form.setError);
                return
            }

            toast.error(error.message)
        }
    }

    const adultFee = form.watch('stayType') === 'DayStay' ? 150 : 180; // full price
    const seniorFee = adultFee - (adultFee * 0.20); // 20 percent discount
    const kidsFee = 100 // just a kid 4-7 years old

    const adultCount = form.watch('adultGuests') || 0;
    const kidsCount = form.watch('kidGuests') || 0;
    const seniorCount = form.watch('seniorGuests') || 0;


    const { totalGuestFee } = useMemo(() => {
        const totalGuestFee = (adultCount * adultFee) + (seniorCount * seniorFee) + (kidsCount * kidsFee);

        return { totalGuestFee };
    }, [kidsCount, adultCount, seniorCount])

    const { checkIn: bookingCheckIn, checkOut: bookingCheckOut } = getBookingDates(checkIn, stayType);

    const total = accommodation.price + addOnTotal + preOrderTotal + totalGuestFee;

    if(confirmation) {
        return (
            <BookingConfirmation
            viewMyBookings={() => {
                reset();
                navigate(`/my-bookings/${confirmation.booking.id}`)
            }}
            backToHome={() => {
                reset();
                navigate('/');
            }}
            accommodation={accommodation}
            booking={confirmation.booking}
            summary={confirmation.summary}
            />
        )
    }

    return (  
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 overflow-y-auto">
                {bookingStep === 'form' && (
                    <GuestForm
                    accommodation={accommodation}
                    selectedStayType={stayType}
                    selectedCheckIn={bookingCheckIn}
                    selectedCheckOut={bookingCheckOut}
                    setBookingStep={setBookingStep}
                    />
                )}

                {bookingStep === 'add-on' && (
                    <AddOnServiceForm
                        setBookingStep={setBookingStep}
                        changeAddOnTotal={(total) => setAddOnTotal(total)}
                    />
                )}

                {bookingStep === 'pre-order' && (
                    <PreOrderForm 
                    setBookingStep={setBookingStep}
                    changePreOrderTotal={(total) => setPreOrderTotal(total)}
                    />
                )}

                {bookingStep === 'review' && (
                    <ReviewForm 
                    accommodation={accommodation}
                    stayType={stayType}
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
                    />
                )}
            </form>
        </FormProvider>
    )
}

export default MultiStepBookingForm