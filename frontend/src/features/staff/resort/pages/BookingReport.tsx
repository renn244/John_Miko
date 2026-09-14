import ReportForm from "@/features/staff/resort/forms/ReportForm";
import type { ReportType } from "@/features/staff/resort/types/staffResort.type";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
const types: ReportType[] = ["checkIn", "checkOut", "maintenance"];
const BookingReport = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  if (!id || !types.includes(type as ReportType))
    return (
      <section className="py-14 text-center">
        <AlertTriangle className="mx-auto size-7 text-destructive" />
        <h1 className="mt-3 font-bold">Report link is invalid</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Open a booking and choose a report type to continue.
        </p>
        <button
          type="button"
          className="mt-4 font-semibold text-primary"
          onClick={() => navigate("/staff/resort/dashboard")}
        >
          Go back
        </button>
      </section>
    );
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>
      <header>
        <h1 className="text-2xl font-bold">New report</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Document the concern clearly for admin review.
        </p>
      </header>
      <ReportForm
        bookingId={id}
        initialType={type as ReportType}
        onCreated={(reportId) =>
          navigate(`/staff/resort/report/${reportId}`, { replace: true })
        }
      />
    </div>
  );
};
export default BookingReport;
