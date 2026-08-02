import { GuestContainer, GuestPageShell } from "@/components/guest";
import { Button } from "@/components/ui/button";
import MultiStepBookingForm from "@/forms/MultiStepBookingForm/MultiStepBookingForm";
import { useGetAccommodationByIdQuery } from "@/hooks/admin/accommodation.hook";
import { cn } from "@/lib/utils";
import { useBookingSelectStore } from "@/store/booking/useBookingSelect";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import NotFoundPage from "./NotFound";

const bookingSteps = [
    "Guest Information",
    "Add-on Services",
    "Pre-order Items",
    "Review Booking",
    "Payment",
];

const Booking = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { accommodationId } = useParams<{ accommodationId: string }>();
    const navigate = useNavigate();
    const bookingDate = useBookingSelectStore((state) => state.bookingDate);
    const bookingType = useBookingSelectStore((state) => state.bookingType);
    const stayOption = useBookingSelectStore((state) => state.stayOption);

    const { data: accommodation, isLoading } = useGetAccommodationByIdQuery(accommodationId)

    if(isLoading) return null

    if(!accommodation) {
        return (
            <NotFoundPage
                title="Accommodation not found"
                message="We could not find the accommodation you are trying to book. Please choose another available stay."
                homeTo="/accommodation"
                homeLabel="Browse Accommodations"
            />
        );
    }

    if (!bookingDate || !bookingType || !stayOption) {
        return <Navigate to={`/accommodation/${accommodation.id}`} replace />;
    }

    return (
        <GuestPageShell className="flex min-h-screen flex-col">
            <header className="border-b bg-background">
                <GuestContainer className="py-3">
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate(`/accommodation/${accommodation.id}`)}
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
                                    <div key={step} className="flex items-center">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    "flex size-7 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                                                    isCompleted && "border-primary bg-primary text-primary-foreground",
                                                    isCurrent && "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20",
                                                    !isCompleted && !isCurrent && "border-border bg-muted/60 text-muted-foreground"
                                                )}
                                            >
                                                {isCompleted ? <Check className="size-4" /> : stepNumber}
                                            </span>
                                            <span
                                                className={cn(
                                                    "text-xs font-semibold",
                                                    isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                                                )}
                                            >
                                                {step}
                                            </span>
                                        </div>

                                        {index < bookingSteps.length - 1 ? (
                                            <span
                                                className={cn(
                                                    "mx-3 h-px w-10 bg-border md:w-16",
                                                    stepNumber < currentStep && "bg-primary"
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
                <MultiStepBookingForm 
                accommodation={accommodation}
                bookingStep={
                    currentStep === 1 ? 'form' 
                    : currentStep === 2 ? 'add-on'
                    : currentStep === 3 ? 'pre-order' 
                    : currentStep === 4 ? 'review' 
                    : 'payment'
                }
                setBookingStep={(data) => {
                    switch(data) {
                        case 'form':
                            setCurrentStep(1);
                            break;
                        case 'add-on':
                            setCurrentStep(2);
                            break;
                        case 'pre-order':
                            setCurrentStep(3);
                            break;
                        case 'review':
                            setCurrentStep(4);
                            break;
                        case 'payment':
                            setCurrentStep(5);
                            break;     
                    }
                }}
                />
            </GuestContainer>
        </GuestPageShell>
    )
}

export default Booking
