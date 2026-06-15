import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MultiStepBookingForm from "@/forms/MultiStepBookingForm/MultiStepBookingForm";
import { useBookingSelectStore } from "@/store/booking/useBookingSelect";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

type AccommodationBookingModalProps = {
    accommodation: Accommodation,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}

const AccommodationBookingModal = ({ accommodation, isOpen, setIsOpen }: AccommodationBookingModalProps) => {
    const [bookingStep, setBookingStep] = useState<'form' | 'add-on' | 'review' | 'pre-order' | 'payment'>('form');
    
    const stayType = useBookingSelectStore((state) => state.bookingType);
    const checkIn = useBookingSelectStore((state) => state.bookingDate);

    const handleClose = () => {
        setBookingStep('form');
        setIsOpen(false);
    }

    const onSuccess = () => {
        setIsOpen(false);
    }

    const getProgressValue = () => {
        switch (bookingStep) {
            case 'form':
                return 20;
            case 'add-on':
                return 40;
            case 'pre-order':
                return 60;
            case 'review':
                return 80;
            case 'payment':
                return 100;
            default:
                return 0;
        }
    };

    return (
        <Sheet 
        open={isOpen && !!stayType && !!checkIn} 
        onOpenChange={(open)  =>  {
            if(!open) {
                setBookingStep('form');
            }

            setIsOpen(open);
        }}
        >
            <SheetContent side="right" className="w-full max-w-xl sm:max-w-2xl gap-0">
                
                <div className="sticky top-0 bg-white z-10 p-6 border-b flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
                            {bookingStep === 'form' && 'Guest Information'}
                            {bookingStep === 'add-on' && 'Add-on Services (Optional)'}
                            {bookingStep === 'pre-order' && 'Pre-order Items (Optional)'}
                            {bookingStep === 'review' && 'Review Booking'}
                            {bookingStep === 'payment' && 'Payment'}
                        </h2>
                        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                            {bookingStep === 'form' && 'Step 1 of 5'}
                            {bookingStep === 'add-on' && 'Step 2 of 5'}
                            {bookingStep === 'pre-order' && 'Step 3 of 5'}
                            {bookingStep === 'review' && 'Step 4 of 5'}
                            {bookingStep === 'payment' && 'Step 5 of 5'}
                        </p>
                        <Progress className="w-full mt-1" value={getProgressValue()} />
                    </div>
                    <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6" style={{ color: '#6B7280' }} />
                    </button>
                </div>

                <MultiStepBookingForm 
                bookingStep={bookingStep}
                setBookingStep={setBookingStep}
                accommodation={accommodation}
                onSuccess={onSuccess}
                />
            </SheetContent>
        </Sheet>
    )
}


export default AccommodationBookingModal
