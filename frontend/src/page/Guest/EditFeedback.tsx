import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import NavBar from "@/components/common/NavBar";
import BookingCard from "@/components/pageComponents/Guest/MyBookings/BookingCard";
import FeedbackForm from "@/forms/FeedbackForm";
import { useGetBookingById } from "@/hooks/admin/booking.hook";
import { useGetFeedbackById, useUpdateFeedbackGuestMutation } from "@/hooks/feedback.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditFeedback = () => {
    const navigate = useNavigate();

    const { feedbackId } = useParams<{ feedbackId: string }>();
    const { data: feedback, isLoading: feedbackLoading, error: feedbackError, refetch: refetchFeedback, isRefetching: isRefetchingFeedback } = useGetFeedbackById(feedbackId!);
    const { data: booking, isLoading: bookingLoading, error: bookingError, refetch: refetchBooking, isRefetching: isRefetchingBooking } = useGetBookingById(feedback?.bookingId!);

    const { mutateAsync } = useUpdateFeedbackGuestMutation(feedbackId!);

    if (feedbackLoading || bookingLoading) return null;

    if (feedbackError || bookingError) {
        return (
            <div className="min-h-screen">
                <NavBar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <ErrorDialog
                    title="Feedback is unavailable"
                    message="We could not load this feedback record. It may no longer belong to your guest account."
                    onBack={() => navigate('/my-bookings')}
                    onRetry={async () => {
                        await refetchFeedback();
                        await refetchBooking();
                    }}
                    retryLoading={isRefetchingFeedback || isRefetchingBooking}
                    />
                </div>
            </div>
        );
    }

    if (!feedback || !booking) {
        return (
            <div className="min-h-screen">
                <NavBar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <NotFoundDialog
                    title="Feedback not available"
                    message="This feedback record cannot be edited from your guest account."
                    onBack={() => navigate('/my-bookings')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <NavBar />
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-start gap-4">
                    <Link to="/my-bookings">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-normal">
                            Edit Feedback
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Update your feedback about your recent stay.
                        </p>
                    </div>
                </div>

                <FeedbackForm 
                isUpdate
                initialData={feedback}
                oncancel={() => navigate('/my-bookings')}
                onsubmit={async (data) => {
                    await mutateAsync(data);
                    navigate('/my-bookings');
                }}
                >
                    <BookingCard 
                    variant="compact"
                    className="border-0 p-0 shadow-none"
                    booking={booking}
                    />
                </FeedbackForm>
            </div>
        </div>
    )
}

export default EditFeedback
