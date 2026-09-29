import { Button } from "@/components/ui/button";
import { useBookingSessionDraft, type BookingDraftMeta } from "@/features/public/bookings/hooks/useBookingSessionDraft";
import { GuestContainer, GuestPageShell } from "@/features/public/layout/components/guest";
import type { Accommodation } from "@/features/shared/accommodations/types/accommodation.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { FormProvider, type DefaultValues } from "react-hook-form";
import { useNavigate } from "react-router";
import {
    MultiStepBookingFormSchema,
    type BookingStep,
    type multiStepBookingFormSchema,
} from "../forms/MultiStepBookingForm";
import MultiStepBookingForm from "../forms/MultiStepBookingForm";
import { cn } from "@/lib/utils";

const bookingSteps: { id: BookingStep; label: string }[] = [
    { id: "form", label: "Guest Information" },
    { id: "add-on", label: "Add-on Services" },
    { id: "pre-order", label: "Pre-order Items" },
    { id: "review", label: "Review Booking" },
    { id: "payment", label: "Payment" },
];

const isBookingStep = (step: unknown): step is BookingStep =>
    bookingSteps.some((bookingStep) => bookingStep.id === step);

type BookingFlowProps = {
    accommodation: Accommodation;
    bookingDate: Date;
    bookingType: string;
};

const BookingFlow = ({ accommodation, bookingDate, bookingType }: BookingFlowProps) => {
    const navigate = useNavigate();
    const defaultValues: DefaultValues<multiStepBookingFormSchema> = {
        firstName: "",
        lastName: "",
        email: "",
        contactNo: "",
        adultGuests: 0,
        seniorGuests: 0,
        kidGuests: 0,
        numberOfGuests: 1,
        specialRequest: "",
        stayOptionId: bookingType,
        checkIn: bookingDate,
        preOrderItems: [],
        addOnServices: [],
        paymentType: undefined,
        paymentMethodId: "",
        proofImageUrl: "",
        validIdImageUrl: "",
    };

    const { form, meta, setMeta, clearDraft } = useBookingSessionDraft({
        formOptions: {
            resolver: zodResolver(MultiStepBookingFormSchema),
            criteriaMode: "all",
            mode: "onSubmit",
            reValidateMode: "onChange",
        },
        defaultValues,
        initialMeta: {
            accommodationId: accommodation.id,
            step: "form",
        },
        isDraftValid: (savedMeta: BookingDraftMeta) =>
            savedMeta.accommodationId === accommodation.id && isBookingStep(savedMeta.step),
        restoreValues: (savedValues, freshValues) => ({
            ...freshValues,
            ...savedValues,
            stayOptionId: bookingType,
            checkIn: bookingDate,
        }),
    });

    const currentStep = bookingSteps.findIndex((step) => step.id === meta.step) + 1;
    const setBookingStep: Dispatch<SetStateAction<BookingStep>> = (nextStep) => {
        setMeta((currentMeta) => ({
            ...currentMeta,
            step: typeof nextStep === "function" ? nextStep(currentMeta.step) : nextStep,
        }));
    };

    const returnToAccommodation = () => {
        clearDraft();
        navigate(`/accommodation/${accommodation.id}`);
    };

    return (
        <GuestPageShell className="flex min-h-screen flex-col">
            <header className="border-b bg-background">
                <GuestContainer className="py-3">
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={returnToAccommodation}
                            className="-ml-2 px-2 text-sm font-semibold hover:text-primary"
                        >
                            <ArrowLeft className="size-4" />
                            Booking Flow
                        </Button>

                        <span className="text-sm font-medium text-muted-foreground">
                            Step {currentStep} of {bookingSteps.length}
                        </span>
                    </div>

                    <div className="mt-5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex min-w-max items-center">
                            {bookingSteps.map((step, index) => {
                                const stepNumber = index + 1;
                                const isCompleted = stepNumber < currentStep;
                                const isCurrent = stepNumber === currentStep;

                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    "flex size-7 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                                                    isCompleted && "border-primary bg-primary text-primary-foreground",
                                                    isCurrent && "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20",
                                                    !isCompleted && !isCurrent && "border-border bg-muted/60 text-muted-foreground",
                                                )}
                                            >
                                                {isCompleted ? <Check className="size-4" /> : stepNumber}
                                            </span>
                                            <span
                                                className={cn(
                                                    "text-xs font-semibold",
                                                    isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground",
                                                )}
                                            >
                                                {step.label}
                                            </span>
                                        </div>

                                        {index < bookingSteps.length - 1 ? (
                                            <span
                                                className={cn(
                                                    "mx-3 h-px w-10 bg-border md:w-16",
                                                    stepNumber < currentStep && "bg-primary",
                                                )}
                                            />
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </GuestContainer>
            </header>

            <GuestContainer className="flex-1 py-5 md:py-6">
                <FormProvider {...form}>
                    <MultiStepBookingForm
                        accommodation={accommodation}
                        bookingStep={meta.step}
                        setBookingStep={setBookingStep}
                        clearDraft={clearDraft}
                    />
                </FormProvider>
            </GuestContainer>
        </GuestPageShell>
    );
};

export default BookingFlow;
