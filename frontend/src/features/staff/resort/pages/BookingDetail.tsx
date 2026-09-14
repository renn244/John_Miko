import BookingDetailContent from "@/features/staff/resort/components/BookingDetailContent";
import { ResortDetailSkeleton } from "@/features/staff/resort/components/ResortLoadingSkeleton";
import { Button } from "@/components/ui/button";
import { useResortBookingById } from "@/features/staff/resort/hooks/useStaffResort";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const BookingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const query = useResortBookingById(id);
  const goBack = () => navigate("/staff/resort/dashboard");

  if (query.isLoading) return <ResortDetailSkeleton />;

  if (query.isError || !query.data) {
    return (
      <section className="py-14 text-center">
        <AlertTriangle className="mx-auto size-7 text-destructive" />
        <h1 className="mt-3 font-bold">Booking not available</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          It may no longer be confirmed or upcoming.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button type="button" variant="outline" onClick={goBack}>
            Go back
          </Button>
          {id ? (
            <Button type="button" onClick={() => query.refetch()}>
              Retry
            </Button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <button
        type="button"
        className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
        onClick={goBack}
      >
        <ArrowLeft className="size-4" />
        Back to bookings
      </button>
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Booking details
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference: {query.data.referenceCode}
        </p>
      </header>
      <BookingDetailContent booking={query.data} />
    </div>
  );
};

export default BookingDetail;
