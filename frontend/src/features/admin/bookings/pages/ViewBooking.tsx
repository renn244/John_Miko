import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import BookingDetailContent from "@/features/admin/bookings/components/booking-detail/BookingDetailContent";
import { useGetBookingById } from "@/features/admin/bookings/hooks/useAdminBookings";
import { useNavigate, useParams } from "react-router";

const ViewBooking = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error, refetch, isRefetching } =
        useGetBookingById(id);

    if (isLoading)
        return (
            <div className="flex h-64 items-center justify-center">
                <LoadingSpinner className="size-10" />
            </div>
        );
    if (error)
        return (
            <ErrorDialog
                onBack={() => navigate(-1)}
                onRetry={refetch}
                retryLoading={isRefetching}
            />
        );
    if (!data)
        return (
            <NotFoundDialog
                onBack={() => navigate(-1)}
                onRetry={refetch}
                retryLoading={isRefetching}
                title="Booking Not Found"
            />
        );

    return <BookingDetailContent booking={data} />;
};

export default ViewBooking;
