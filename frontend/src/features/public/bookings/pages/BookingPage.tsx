import BookingFlow from "@/features/public/bookings/components/BookingFlow";
import { useBookingSelectStore } from "@/features/public/bookings/store/bookingSelect.store";
import { useGetAccommodationByIdQuery } from "@/features/shared/accommodations/hooks/useAccommodationQueries";
import NotFoundPage from "@/page/NotFound";
import { Navigate, useParams } from "react-router";

const BookingPage = () => {
    const { accommodationId } = useParams<{ accommodationId: string }>();
    const bookingDate = useBookingSelectStore((state) => state.bookingDate);
    const bookingType = useBookingSelectStore((state) => state.bookingType);
    const stayOption = useBookingSelectStore((state) => state.stayOption);
    const { data: accommodation, isLoading } = useGetAccommodationByIdQuery(accommodationId);

    if (isLoading) return null;

    if (!accommodation) {
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
        <BookingFlow
            accommodation={accommodation}
            bookingDate={bookingDate}
            bookingType={bookingType}
        />
    );
};

export default BookingPage;
