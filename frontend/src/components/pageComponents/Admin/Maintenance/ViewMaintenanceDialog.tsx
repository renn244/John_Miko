import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import {
  formatMaintenanceDateTime,
  formatMaintenanceShortDate,
  getMaintenancePriorityClasses,
  getMaintenanceStatusLabel,
  MAINTENANCE_STATUS_ORDER,
} from "@/components/pageComponents/Admin/Maintenance/maintenanceDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useClosedMaintenanceMutation, useGetMaintenancebyId, useStartMaintnenanceMutation } from "@/hooks/admin/maintenance.hook";
import { cn } from "@/lib/utils";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import type { Maintenance } from "@/types/admin/maintenance.type";
import { Check, Edit, Lock, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const ViewMaintenanceDialog = () => {
  const isViewOpen = useMaintenanceStore((state) => state.isViewOpen);
  const viewId = useMaintenanceStore((state) => state.viewId);
  const setIsViewOpen = useMaintenanceStore((state) => state.setIsViewOpen);

  const { data, isLoading, error, refetch, isRefetching } = useGetMaintenancebyId(viewId);

  return (
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-4xl" showCloseButton={false}>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner className="size-10" />
          </div>
        ) : null}

        {error ? (
          <div className="p-6">
            <ErrorDialog onBack={() => setIsViewOpen(false)} onRetry={refetch} retryLoading={isRefetching} />
          </div>
        ) : null}

        {!data && !isLoading && !error && isViewOpen ? (
          <div className="p-6">
            <NotFoundDialog
              onBack={() => setIsViewOpen(false)}
              onRetry={refetch}
              retryLoading={isRefetching}
              title="Maintenance Ticket Not Found"
            />
          </div>
        ) : null}

        {data ? <MaintenanceDetails maintenance={data} /> : null}
      </DialogContent>
    </Dialog>
  );
};

const MaintenanceDetails = ({ maintenance }: { maintenance: Maintenance }) => {
  const setIsViewOpen = useMaintenanceStore((state) => state.setIsViewOpen);
  const setCompleteId = useMaintenanceStore((state) => state.setCompleteId);
  const startMutation = useStartMaintnenanceMutation();
  const closeMutation = useClosedMaintenanceMutation();
  const [selectedImage, setSelectedImage] = useState(maintenance.imagesUrl?.[0] ?? null);

  const openMarkComplete = () => {
    setIsViewOpen(false);
    setCompleteId(maintenance.id);
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <DialogHeader className="border-b px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <DialogDescription className="pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Ticket Status
          </DialogDescription>
          <button
            type="button"
            onClick={() => setIsViewOpen(false)}
            className="text-2xl leading-none text-slate-500 transition hover:text-slate-800"
            aria-label="Close details"
          >
            ×
          </button>
        </div>
        <RightChevronStepper maintenance={maintenance} />
      </DialogHeader>

      <div className="space-y-5 px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-primary">{maintenance.id}</span>
              <Badge variant="outline" className="rounded-md bg-slate-50 px-2 py-0.5 text-slate-700">
                {getMaintenanceStatusLabel(maintenance.status)}
              </Badge>
            </div>
            <DialogTitle className="mt-2 text-2xl leading-tight tracking-tight">
              {maintenance.title}
            </DialogTitle>
          </div>

          <Badge
            className={cn(
              "shrink-0 rounded-xl px-4 py-1.5 text-sm font-medium shadow-none",
              getMaintenancePriorityClasses(maintenance.priority)
            )}
          >
            {maintenance.priority} Priority
          </Badge>
        </div>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight">Description</h3>
          <div className="border-t pt-3 text-sm leading-7 text-foreground/90">
            {maintenance.description}
          </div>
        </section>

        <div className="grid gap-3 md:grid-cols-2">
          <MetaCard label="Created" value={formatMaintenanceDateTime(maintenance.createdAt)} />
          <MetaCard label="Updated" value={formatMaintenanceDateTime(maintenance.updatedAt)} />
          <MetaCard label="Started" value={formatMaintenanceDateTime(maintenance.startedAt)} />
          <MetaCard label="Resolved" value={formatMaintenanceDateTime(maintenance.resolvedAt)} />
        </div>

        {maintenance.resolutionNotes ? (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Resolution Notes</h3>
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-900">
              {maintenance.resolutionNotes}
            </div>
          </section>
        ) : null}

        {maintenance.notes ? (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Work Notes</h3>
            <div className="rounded-2xl border bg-slate-50 px-5 py-4 text-sm leading-7 text-foreground/90">
              {maintenance.notes}
            </div>
          </section>
        ) : null}

        {maintenance.imagesUrl?.length ? (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Photo Attachments</h3>
            <div className="space-y-3">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={maintenance.title}
                  className="h-72 w-full rounded-2xl border object-cover"
                />
              ) : null}

              {maintenance.imagesUrl.length > 1 ? (
                <div className="flex flex-wrap gap-3">
                  {maintenance.imagesUrl.map((imageUrl, index) => (
                    <button
                      key={`${maintenance.id}-image-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(imageUrl)}
                      className={cn(
                        "overflow-hidden rounded-xl border bg-background transition",
                        selectedImage === imageUrl ? "border-primary ring-2 ring-primary/15" : "border-border"
                      )}
                    >
                      <img
                        src={imageUrl}
                        alt={`${maintenance.title} attachment ${index + 1}`}
                        className="h-16 w-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <div className="grid gap-3 pt-1 sm:grid-cols-2">
          <Button variant="outline" className="h-11 rounded-xl text-sm" asChild>
            <Link to={`/admin/maintenance/${maintenance.id}/edit`} onClick={() => setIsViewOpen(false)}>
              <Edit className="size-4" />
              Edit Ticket
            </Link>
          </Button>

          {maintenance.status === "Pending" ? (
            <Button
              className="h-11 rounded-xl text-sm"
              disabled={startMutation.isPending}
              onClick={() => startMutation.mutate(maintenance.id)}
            >
              <Play className="size-4" />
              Start Maintenance
            </Button>
          ) : null}

          {maintenance.status === "InProgress" ? (
            <Button className="h-11 rounded-xl text-sm sm:col-start-2" onClick={openMarkComplete}>
              <Check className="size-4" />
              Mark Complete
            </Button>
          ) : null}

          {maintenance.status === "Completed" ? (
            <Button
              className="h-11 rounded-xl text-sm sm:col-start-2"
              disabled={closeMutation.isPending}
              onClick={() => closeMutation.mutate(maintenance.id)}
            >
              <Lock className="size-4" />
              Close Ticket
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const CHEVRON_CLIP =
  "polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)";

const LAST_STEP_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

const RightChevronStepper = ({ maintenance }: { maintenance: Maintenance }) => {
  const activeIndex = MAINTENANCE_STATUS_ORDER.indexOf(maintenance.status);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[720px] items-stretch gap-0">
        {MAINTENANCE_STATUS_ORDER.map((status, index) => {
          const isActive = maintenance.status === status;
          const isCompleted = activeIndex > index;
          const isLast = index === MAINTENANCE_STATUS_ORDER.length - 1;
          const stepDate = getStepperDate(maintenance, status);
          const clipPath = isLast ? LAST_STEP_CLIP : CHEVRON_CLIP;

          return (
            <div
              key={status}
              className={cn("min-w-0 flex-1", index > 0 ? "-ml-6" : "")}
              style={{
                zIndex: MAINTENANCE_STATUS_ORDER.length - index,
              }}
            >
              {/* fake border / outline */}
              <div
                className={cn(
                  "h-full p-[1.5px]",
                  index === 0 ? "rounded-l-xl" : "",
                  isLast ? "rounded-r-xl" : "",
                  isActive
                    ? "bg-primary"
                    : isCompleted
                      ? "bg-primary/40"
                      : "bg-slate-300"
                )}
                style={{ clipPath }}
              >
                {/* actual step */}
                <div
                  className={cn(
                    "relative flex h-full min-h-14 items-center px-7 py-2.5",
                    index === 0 ? "rounded-l-xl" : "",
                    isLast ? "rounded-r-xl" : "",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-blue-50 text-primary"
                        : "bg-white text-slate-500"
                  )}
                  style={{ clipPath }}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={cn(
                        "mt-0.5 flex size-5 items-center justify-center rounded-full text-[10px] font-semibold",
                        isActive
                          ? "bg-white/20 text-white"
                          : isCompleted
                            ? "bg-primary text-white"
                            : "bg-slate-200 text-slate-500"
                      )}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {getMaintenanceStatusLabel(status)}
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-[11px]",
                          isActive ? "text-white/85" : "text-slate-500"
                        )}
                      >
                        {stepDate ?? "Pending"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MetaCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl border bg-white px-4 py-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
};

const getStepperDate = (maintenance: Maintenance, status: Maintenance["status"]) => {
  switch (status) {
    case "Pending":
      return formatMaintenanceShortDate(maintenance.createdAt);
    case "InProgress":
      return formatMaintenanceShortDate(maintenance.startedAt);
    case "Completed":
      return formatMaintenanceShortDate(maintenance.resolvedAt);
    case "Closed":
      return formatMaintenanceShortDate(maintenance.closedAt ?? maintenance.updatedAt);
  }
};

export default ViewMaintenanceDialog;
