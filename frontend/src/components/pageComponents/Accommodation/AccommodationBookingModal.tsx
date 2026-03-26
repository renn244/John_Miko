import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MultiStepBookingForm from "@/forms/MultiStepBookingForm/MultiStepBookingForm";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

type AccommodationBookingModalProps = {
    accommodation: Accommodation,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    selectedStayType: 'overnight' | 'daystay',
    selectedCheckIn: Date,
}

const AccommodationBookingModal = ({ accommodation, isOpen, setIsOpen, selectedStayType, selectedCheckIn }: AccommodationBookingModalProps) => {
    const [bookingStep, setBookingStep] = useState<'form' | 'review' | 'payment'>('form');
    
    const handleClose = () => {
        setIsOpen(false);
    }

    const getProgressValue = () => {
        switch (bookingStep) {
            case 'form':
                return 33;
            case 'review':
                return 66;
            case 'payment':
                return 100;
            default:
                return 0;
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-full max-w-xl sm:max-w-2xl gap-0">
                
                <div
                className="sticky top-0 bg-white z-10 p-6 border-b flex items-center justify-between"
                style={{ borderColor: '#E5E7EB' }}
                >
                    <div className="flex-1">
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
                stayType={selectedStayType}
                checkIn={selectedCheckIn}
                />
            </SheetContent>
        </Sheet>
    )
}


export default AccommodationBookingModal