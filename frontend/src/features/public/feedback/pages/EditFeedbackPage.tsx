import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import NavBar from "@/features/public/layout/components/NavBar";
import { GuestContainer, GuestPageShell } from "@/features/public/layout/components/guest";
import BookingCard from "@/features/public/bookings/components/BookingCard";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import FeedbackForm from "@/features/public/feedback/forms/FeedbackForm";
import { useGetBookingById } from "@/features/admin/bookings/hooks/useAdminBookings";
import { useGetFeedbackById, useUpdateFeedbackGuestMutation } from "@/features/public/feedback/hooks/useGuestFeedback";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditFeedback = () => {
    const navigate = useNavigate();

    const { feedbackId } = useParams<{ feedbackId: string }>();
    const { data: feedback, isLoading: feedbackLoading, error: feedbackError, refetch: refetchFeedback, isRefetching: isRefetchingFeedback } = useGetFeedbackById(feedbackId!);
    const { data: booking, isLoading: bookingLoading, error: bookingError, refetch: refetchBooking, isRefetching: isRefetchingBooking } = useGetBookingById(feedback?.bookingId);

    const { mutateAsync } = useUpdateFeedbackGuestMutation(feedbackId!);

    if (feedbackLoading || bookingLoading) {
        return (
            <GuestPageShell>
                <NavBar />
                <GuestContainer className="flex flex-1 items-center justify-center py-10" aria-label="Loading feedback">
                    <LoadingSpinner />
                </GuestContainer>
            </GuestPageShell>
        );
    }

    if (feedbackError || bookingError) {
        return (
            <GuestPageShell>
                <NavBar />
                <GuestContainer className="flex-1 py-6">
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
                </GuestContainer>
            </GuestPageShell>
        );
    }

    if (!feedback || !booking) {
        return (
            <GuestPageShell>
                <NavBar />
                <GuestContainer className="flex-1 py-6">
                    <NotFoundDialog
                    title="Feedback not available"
                    message="This feedback record cannot be edited from your guest account."
                    onBack={() => navigate('/my-bookings')}
                    />
                </GuestContainer>
            </GuestPageShell>
        );
    }

    return (
        <GuestPageShell>
            <NavBar />
            <GuestContainer className="max-w-5xl flex-1 space-y-6 py-6">
                <div className="flex items-start gap-4">
                    <Button asChild size="icon" variant="outline">
                        <Link to="/my-bookings" aria-label="Back to My Bookings">
                            <ArrowLeft className="size-5 text-muted-foreground" />
                        </Link>
                    </Button>
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
            </GuestContainer>
        </GuestPageShell>
    )
}

export default EditFeedback
