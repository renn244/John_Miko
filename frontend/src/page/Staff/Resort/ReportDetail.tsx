import ReportDetailContent from "@/components/pageComponents/Staff/Resort/ReportDetailContent";
import { ResortDetailSkeleton } from "@/components/pageComponents/Staff/Resort/ResortLoadingSkeleton";
import { Button } from "@/components/ui/button";
import { useResortReportById } from "@/hooks/staff/resort.hook";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const ReportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const query = useResortReportById(id);
  const goBack = () => navigate("/staff/resort/reports");

  if (query.isLoading) return <ResortDetailSkeleton />;

  if (query.isError || !query.data) {
    return (
      <section className="py-14 text-center">
        <AlertTriangle className="mx-auto size-7 text-destructive" />
        <h1 className="mt-3 font-bold">Report not available</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          It may not exist or you may not have access to it.
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
        Back to reports
      </button>
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Report details
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference: RPT-{query.data.id.slice(-4).toUpperCase()}
        </p>
      </header>
      <ReportDetailContent report={query.data} />
    </div>
  );
};

export default ReportDetail;
