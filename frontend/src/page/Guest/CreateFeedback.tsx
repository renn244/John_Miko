import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import NavBar from "@/components/common/NavBar";
import BookingCard from "@/components/pageComponents/Guest/MyBookings/BookingCard";
import { Button } from "@/components/ui/button";
import FeedbackForm from "@/forms/FeedbackForm";
import { useGetBookingById } from "@/hooks/admin/booking.hook";
import { useCreateFeedbackGuestMutation } from "@/hooks/feedback.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const CreateFeedback = () => {
    const navigate = useNavigate();

    const { bookingId } = useParams<{ bookingId: string }>();
    const { data: booking, isLoading, error, refetch, isRefetching } = useGetBookingById(bookingId);

    const { mutateAsync } = useCreateFeedbackGuestMutation(bookingId!);

    // TODO LATER: also put a warning that a feedback already exists for this booking and ask if they want to update the feedback instead of creating a new one

    if (isLoading) return null;

    if (error) {
        return (
            <div className="min-h-screen">
                <NavBar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <ErrorDialog
                    title="Feedback is unavailable"
                    message="We could not load this booking for feedback. It may not belong to your account."
                    onBack={() => navigate('/my-bookings')}
                    onRetry={() => refetch()}
                    retryLoading={isRefetching}
                    />
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen">
                <NavBar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <NotFoundDialog
                    title="Booking not available"
                    message="This booking cannot be reviewed from your guest account."
                    onBack={() => navigate('/my-bookings')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div  className="flex items-center gap-4">
                    <Link to='/my-bookings'>
                        <Button size="icon" variant="outline">
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold">
                            Create Feedback
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Share your experience and help us improve our services by providing feedback for your recent stay.
                        </p>
                    </div>
                </div>

                <FeedbackForm
                oncancel={() => navigate('/my-bookings')} 
                onsubmit={async (data) => {
                    await mutateAsync(data);
                    navigate('/my-bookings');
                }}
                >
                    <BookingCard 
                    variant="compact"
                    className="p-0 px-1 border-0"
                    booking={booking}
                    />
                </FeedbackForm>
            </div>
        </div>
    )
}

export default CreateFeedback
