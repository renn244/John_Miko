import { useCreateBookingMutation } from "@/hooks/booking.hook";
import { toDateOnly } from "@/lib/date.util";
import { getBookingDates } from "@/lib/getBookingDates";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { useBookingSelectStore } from "@/store/booking/useBookingSelect";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import GuestForm from "./GuestForm";
import PaymentForm from "./PaymentForm";
import PreOrderForm from "./PreOrderForm";
import ReviewForm from "./ReviewForm";

type MultiStepBookingFormProps = {
    accommodation: Accommodation,
    bookingStep: 'form' | 'review' | 'pre-order' | 'payment',
    setBookingStep: React.Dispatch<React.SetStateAction<'form' | 'review' | 'pre-order' | 'payment'>>,
    onSuccess?: () => void;
}

// We are makinga multi-step form, because later on it will have more step like pre order and other things.
const MultiStepBookingFormSchema = z.object({
    // Step 1 - Guest Information
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.email().nonempty("Email is required"),
    contactNo: z.string().nonempty("Phone number is required"),
    
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

    // Step 4 - Payment
    paymentType: z.enum(['Full', 'Partial']),
})

export type multiStepBookingFormSchema = z.infer<typeof MultiStepBookingFormSchema>;

const MultiStepBookingForm = ({ 
    accommodation, bookingStep, setBookingStep, onSuccess
}: MultiStepBookingFormProps) => {
    const [preOrderTotal, setPreOrderTotal] = useState(0);

    const stayType = useBookingSelectStore((state) => state.bookingType!);
    const checkIn = useBookingSelectStore((state) => state.bookingDate!);
    const reset = useBookingSelectStore((state) => state.reset);
    
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
            paymentType: undefined,
        },
        criteriaMode: "all"
    })

    const { mutateAsync, isPending } = useCreateBookingMutation();

    const onSubmit = async (data: multiStepBookingFormSchema) => {
        const { firstName, lastName, checkIn, ...rest } = data;

        await mutateAsync({
            accommodationId: accommodation.id,
            name: `${data.firstName} ${data.lastName}`,
            checkIn: toDateOnly(checkIn),
            ...rest
        }, {
            onSuccess: (data) => {
                onSuccess?.();
                reset();
                
                toast.promise<void>(
                    () => new Promise((resolve) => setTimeout(() => resolve(), 1500)),
                    {
                        loading: "Redirecting...",
                        success: () => {
                            window.location.href = data.checkoutUrl;
                            return "Redirecting to payment gateway!";
                        }
                    }
                )
            },
            onError: (error) => {
                if(error instanceof ValidationError) {
                    handleNestError(error.response, form.setError);
                    return
                }
                
                toast.error(error.message)   
            }
        });
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

    const total = accommodation.price  + preOrderTotal + totalGuestFee;

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