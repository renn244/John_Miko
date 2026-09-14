import KitchenOrderDetailContent from "@/features/staff/kitchen/components/KitchenOrderDetailContent";
import { KitchenOrderDetailSkeleton } from "@/features/staff/kitchen/components/KitchenLoadingSkeleton";
import { Button } from "@/components/ui/button";
import { useKitchenOrderById } from "@/features/staff/kitchen/hooks/useStaffKitchen";
import { AlertTriangle, ArrowLeft, ClipboardList } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const KitchenOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const query = useKitchenOrderById(id);
  const goBack = () => navigate("/staff/kitchen/dashboard");
  if (query.isLoading) return <KitchenOrderDetailSkeleton />;
  if (!id)
    return (
      <section className="py-14 text-center">
        <ClipboardList className="mx-auto size-7 text-primary" />
        <h1 className="mt-3 font-bold">Missing order ID</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This order link is incomplete.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={goBack}
        >
          Go back
        </Button>
      </section>
    );
  if (query.isError || !query.data)
    return (
      <section className="py-14 text-center">
        <AlertTriangle className="mx-auto size-7 text-destructive" />
        <h1 className="mt-3 font-bold">Could not load this order</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Check your connection and try again.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button type="button" variant="outline" onClick={goBack}>
            Go back
          </Button>
          <Button type="button" onClick={() => query.refetch()}>
            Retry
          </Button>
        </div>
      </section>
    );
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <button
        type="button"
        onClick={goBack}
        className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to queue
      </button>
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Kitchen order
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference: {query.data.referenceCode}
        </p>
      </header>
      <KitchenOrderDetailContent order={query.data} />
    </div>
  );
};

export default KitchenOrderDetail;
