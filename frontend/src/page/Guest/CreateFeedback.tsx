import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import NavBar from "@/components/common/NavBar";
import { GuestContainer, GuestPageShell } from "@/components/guest";
import BookingCard from "@/components/pageComponents/Guest/MyBookings/BookingCard";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
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

    if (isLoading) {
        return (
            <GuestPageShell>
                <NavBar />
                <GuestContainer className="flex flex-1 items-center justify-center py-10" aria-label="Loading booking for feedback">
                    <LoadingSpinner />
                </GuestContainer>
            </GuestPageShell>
        );
    }

    if (error) {
        return (
            <GuestPageShell>
                <NavBar />
                <GuestContainer className="flex-1 py-6">
                    <ErrorDialog
                    title="Feedback is unavailable"
                    message="We could not load this booking for feedback. It may not belong to your account."
                    onBack={() => navigate('/my-bookings')}
                    onRetry={() => refetch()}
                    retryLoading={isRefetching}
                    />
                </GuestContainer>
            </GuestPageShell>
        );
    }

    if (!booking) {
        return (
            <GuestPageShell>
                <NavBar />
                <GuestContainer className="flex-1 py-6">
                    <NotFoundDialog
                    title="Booking not available"
                    message="This booking cannot be reviewed from your guest account."
                    onBack={() => navigate('/my-bookings')}
                    />
                </GuestContainer>
            </GuestPageShell>
        );
    }

    if (booking.status !== "Completed" && booking.status !== "Cancelled") {
        return (
            <GuestPageShell>
                <NavBar />
                <GuestContainer className="flex-1 space-y-4 py-6">
                    <h1 className="text-2xl font-bold">Feedback is not available yet</h1>
                    <p className="text-muted-foreground">
                        You can submit feedback once your booking is completed or cancelled.
                        Payment approval alone does not make a booking eligible.
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/my-bookings">Back to My Bookings</Link>
                    </Button>
                </GuestContainer>
            </GuestPageShell>
        );
    }

    return (
        <GuestPageShell>
            <NavBar />
            <GuestContainer className="max-w-5xl flex-1 space-y-6 py-6">
                <div  className="flex items-start gap-4">
                    <Button asChild size="icon" variant="outline">
                        <Link to="/my-bookings" aria-label="Back to My Bookings">
                            <ArrowLeft className="size-5 text-muted-foreground" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-normal">
                            Create Feedback
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
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
                    className="border-0 p-0 shadow-none"
                    booking={booking}
                    />
                </FeedbackForm>
            </GuestContainer>
        </GuestPageShell>
    )
}

export default CreateFeedback
