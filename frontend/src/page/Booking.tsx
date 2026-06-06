import { Progress } from "@/components/ui/progress";
import MultiStepBookingForm from "@/forms/MultiStepBookingForm/MultiStepBookingForm";
import { useGetAccommodationByIdQuery } from "@/hooks/admin/accommodation.hook";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

const Booking = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { accommodationId } = useParams<{ accommodationId: string }>();

    const { data: accommodation, isLoading } = useGetAccommodationByIdQuery(accommodationId)

    if(isLoading) return null

    if(!accommodation) return null; // return 404 page

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
            {/** Booking steps updated to include Add-on Services before Pre-order */}
            {/** Steps: Guest Info -> Add-ons -> Pre-order -> Review -> Payment */}
            {/** Total steps: 5 */}

            <div className="w-full border-b-2">
                <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-xl font-bold">
                            Complete Your Booking
                        </h1>

                        <span className="text-sm font-medium text-muted-foreground">
                            Step {currentStep} of 5
                        </span>
                    </div>

                    <div className="relative">
                        <Progress className="w-full mt-1" value={20 * currentStep} />

                        <div className="flex items-center justify-between  mt-4">
                            {['Guest Information', 'Add-on Services', 'Pre-order Items', 'Review Booking', 'Payment'].map((step, index) => (
                                <div key={step} className="flex flex-col items-center w-1/5">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all  ${
                                        index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                                    }`}>
                                        {index + 1 < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                    </div>
                                    <span
                                    className={`text-xs mt-2 tex-center font-medium hidden sm:block ${
                                        index + 1 === currentStep ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                                    >
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>
            </div>

            <main className="w-full max-w-4xl flex-1">
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
            </main>
        </div>
    )
}

export default Booking