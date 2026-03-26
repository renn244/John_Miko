import BOOKING_FEES from "@/lib/constant/BOOKING_FEES.constant";
import { getBookingDates } from "@/lib/getBookingDates";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import GuestForm from "./GuestForm";
import PaymentForm from "./PaymentForm";
import ReviewForm from "./ReviewForm";

type MultiStepBookingFormProps = {
    accommodation: Accommodation,
    stayType: 'overnight' | 'daystay',
    checkIn: Date,
    bookingStep: 'form' | 'review' | 'payment',
    setBookingStep: React.Dispatch<React.SetStateAction<'form' | 'review' | 'payment'>>
}

// We are makinga multi-step form, because later on it will have more step like pre order and other things.
const MultiStepBookingFormSchema = z.object({
    // Step 1 - Guest Information
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.email().nonempty("Email is required"),
    contactNo: z.string().nonempty("Phone number is required"),
    numberOfGuests: z.number().min(1, "At least 1 guest"),
    specialRequest: z.string().optional(),

    // Step 2 - Review (No additional fields, just confirmation)
    stayType: z.enum(['overnight', 'daystay']),
    checkIn: z.date("Check-in date is required"),

    // Step 3 - Payment
    paymentType: z.enum(['full', 'partial']),
})

export type multiStepBookingFormSchema = z.infer<typeof MultiStepBookingFormSchema>;

const MultiStepBookingForm = ({ 
    accommodation, stayType, checkIn, bookingStep, setBookingStep
}: MultiStepBookingFormProps) => {
    const form = useForm<multiStepBookingFormSchema>({
        resolver: zodResolver(MultiStepBookingFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            contactNo: '',
            numberOfGuests: 1,
            specialRequest: '',
            stayType: stayType,
            checkIn: checkIn,
            paymentType: undefined,
        },
        criteriaMode: "all"
    })

    // put hooks here later on

    const onSubmit = async (data: multiStepBookingFormSchema) => {
        console.log(data);
    }

    const { checkIn: bookingCheckIn, checkOut: bookingCheckOut } = getBookingDates(checkIn, stayType);

    const rate = accommodation.price;
    const serviceFee = BOOKING_FEES.SERVICE_FEE;
    // const guestFee = 50 * (form.watch('numberOfGuests') - 1); // assuming the rate is for 1 guest, and additional guests will be charged
    const total = rate + (serviceFee ?? 0);

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

                {bookingStep === 'review' && (
                    <ReviewForm 
                    accommodation={accommodation}
                    stayType={stayType}
                    price={rate}
                    serviceFee={serviceFee}
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
                    />
                )}
            </form>
        </FormProvider>
    )
}

export default MultiStepBookingForm