import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import {
  formatMaintenanceDateTime,
  formatMaintenanceShortDate,
  getMaintenanceAssigneeLabel,
  getMaintenancePriorityClasses,
  getMaintenanceStatusClasses,
  getMaintenanceStatusLabel,
  MAINTENANCE_STATUS_ORDER,
} from "@/components/pageComponents/Admin/Maintenance/maintenanceDisplay";
import MarkCompleteDialog from "@/components/pageComponents/Admin/Maintenance/MarkCompleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  useClosedMaintenanceMutation,
  useGetMaintenancebyId,
  useStartMaintnenanceMutation,
} from "@/hooks/admin/maintenance.hook";
import { cn } from "@/lib/utils";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import type { Maintenance } from "@/types/admin/maintenance.type";
import {
  Check,
  Edit,
  Lock,
  Play,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const ViewMaintenance = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isRefetching } = useGetMaintenancebyId(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner className="size-10" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDialog onBack={() => navigate("/admin/maintenance")} onRetry={refetch} retryLoading={isRefetching} />
    );
  }

  if (!data) {
    return (
      <NotFoundDialog
        title="Maintenance Ticket Not Found"
        onBack={() => navigate("/admin/maintenance")}
        onRetry={refetch}
        retryLoading={isRefetching}
      />
    );
  }

  return <ViewMaintenanceContent maintenance={data} />;
};

const ViewMaintenanceContent = ({ maintenance }: { maintenance: Maintenance }) => {
  const setCompleteId = useMaintenanceStore((state) => state.setCompleteId);
  const startMutation = useStartMaintnenanceMutation();
  const closeMutation = useClosedMaintenanceMutation();
  const [selectedImage, setSelectedImage] = useState(maintenance.imagesUrl?.[0] ?? null);

  const activityItems = useMemo(
    () =>
      [
        { label: "Ticket Created", value: maintenance.createdAt },
        { label: "Work Started", value: maintenance.startedAt },
        { label: "Marked Complete", value: maintenance.resolvedAt },
        { label: "Ticket Closed", value: maintenance.closedAt },
      ].filter((item) => item.value),
    [maintenance.closedAt, maintenance.createdAt, maintenance.resolvedAt, maintenance.startedAt],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <AdminPageHeader
        backTo="/admin/maintenance"
        backLabel="Back to maintenance board"
        title="Maintenance Details"
        description={maintenance.id}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("border", getMaintenanceStatusClasses(maintenance.status))}>
              {getMaintenanceStatusLabel(maintenance.status)}
            </Badge>
            <Badge className={cn("border", getMaintenancePriorityClasses(maintenance.priority))}>
              {maintenance.priority} Priority
            </Badge>
          </div>
        }
      />

      <MaintenanceStepper maintenance={maintenance} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <div className="pb-4">
              <SectionHeader title="Ticket Information" />

              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">{maintenance.title}</h2>
                <p className="text-sm text-muted-foreground">Ticket Reference: {maintenance.id}</p>
              </div>
            </div>

            <div className="pt-5">
              <div className="space-y-5">
                <ContentSection title="Issue Description">
                  <p className="text-sm leading-6 text-foreground/90">{maintenance.description}</p>
                </ContentSection>

                {maintenance.notes ? (
                  <ContentSection title="Work Notes">
                    <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm leading-6 text-foreground/90">
                      {maintenance.notes}
                    </div>
                  </ContentSection>
                ) : null}

                {maintenance.resolutionNotes ? (
                  <ContentSection title="Resolution Notes">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950">
                      {maintenance.resolutionNotes}
                    </div>
                  </ContentSection>
                ) : null}

                <div className="grid gap-4 pt-2 sm:grid-cols-2">
                  <DetailField label="Expertise Required" value={maintenance.expertise} />
                  <DetailField label="Assigned To" value={getMaintenanceAssigneeLabel(maintenance)} />
                </div>
              </div>
            </div>
          </Card>

          {maintenance.imagesUrl?.length ? (
            <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
              <SectionHeader
                title="Attached Media"
                detail={`${maintenance.imagesUrl.length} ${maintenance.imagesUrl.length === 1 ? "photo" : "photos"}`}
              />

              <div className="space-y-3">
                {selectedImage ? (
                  <ViewPhotoDialog imageUrl={selectedImage}>
                    <button type="button" className="w-full overflow-hidden rounded-lg border bg-muted text-left">
                      <img src={selectedImage} alt={maintenance.title} className="h-80 w-full object-cover" />
                    </button>
                  </ViewPhotoDialog>
                ) : null}

                {maintenance.imagesUrl.length > 1 ? (
                  <div className="flex flex-wrap gap-3">
                    {maintenance.imagesUrl.map((imageUrl, index) => (
                      <button
                        key={`${maintenance.id}-image-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(imageUrl)}
                        className={cn(
                          "overflow-hidden rounded-lg border bg-background transition",
                          selectedImage === imageUrl ? "border-primary ring-2 ring-primary/15" : "border-border",
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
            </Card>
          ) : null}

          {maintenance.resolutionProofImages?.length ? (
            <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
              <SectionHeader
                title="Resolution Proof"
                detail={`${maintenance.resolutionProofImages.length} ${maintenance.resolutionProofImages.length === 1 ? "photo" : "photos"}`}
              />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {maintenance.resolutionProofImages.map((imageUrl, index) => (
                  <ViewPhotoDialog key={`${maintenance.id}-proof-${index}`} imageUrl={imageUrl}>
                    <button type="button" className="overflow-hidden rounded-lg border bg-muted text-left">
                      <img
                        src={imageUrl}
                        alt={`${maintenance.title} resolution proof ${index + 1}`}
                        className="h-44 w-full object-cover"
                      />
                    </button>
                  </ViewPhotoDialog>
                ))}
              </div>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6 xl:sticky xl:top-6">
          <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <SectionHeader title="Quick Snapshot" />

            <div className="space-y-3 text-sm">
              <SnapshotRow label="Expertise" value={maintenance.expertise} />
              <SnapshotRow label="Assigned" value={getMaintenanceAssigneeLabel(maintenance)} />
            </div>
          </Card>

          <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <SectionHeader title="Activity" />

            <div className="ml-3 border-l border-slate-300">
              {activityItems.map((item, index) => (
                <div key={item.label} className={cn("relative pl-6", index > 0 ? "mt-6" : "")}>
                  <div
                    className="absolute -left-[5px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-card"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatMaintenanceDateTime(item.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <SectionHeader title="Actions" />

            <div className="space-y-3">
              <Button className="w-full" variant="outline" asChild>
                <Link to={`/admin/maintenance/${maintenance.id}/edit`}>
                  <Edit className="size-4" />
                  Edit Ticket
                </Link>
              </Button>

              {maintenance.status === "Pending" ? (
                <Button
                  className="w-full"
                  disabled={startMutation.isPending}
                  onClick={() => startMutation.mutate(maintenance.id)}
                >
                  <Play className="size-4" />
                  Start Maintenance
                </Button>
              ) : null}

              {maintenance.status === "InProgress" ? (
                <Button className="w-full" onClick={() => setCompleteId(maintenance.id)}>
                  <Check className="size-4" />
                  Mark Complete
                </Button>
              ) : null}

              {maintenance.status === "Completed" ? (
                <Button
                  className="w-full"
                  disabled={closeMutation.isPending}
                  onClick={() => closeMutation.mutate(maintenance.id)}
                >
                  <Lock className="size-4" />
                  Close Ticket
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      </div>

      <MarkCompleteDialog />
    </div>
  );
};

const statusSteps = ["Pending", "Started", "Done", "Closed"] as const;
const stepperColors = {
  active: "#0E33F3",
  complete: "#DDFBEF",
  idle: "#EEF2F6",
  divider: "#FFFFFF",
} as const;

const MaintenanceStepper = ({ maintenance }: { maintenance: Maintenance }) => {
  const activeIndex = MAINTENANCE_STATUS_ORDER.indexOf(maintenance.status);

  return (
    <>
      <div className="space-y-0 px-1 md:hidden">
        {MAINTENANCE_STATUS_ORDER.map((status, index) => {
          const isActive = maintenance.status === status;
          const isCompleted = activeIndex > index;
          const isLast = index === MAINTENANCE_STATUS_ORDER.length - 1;
          const date = getStepperDate(maintenance, status);

          return (
            <div key={status} className="flex gap-3">
              <div className="flex w-5 flex-col items-center">
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-primary/80 text-primary-foreground"
                        : "border border-border bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="size-3" /> : index + 1}
                </div>
                {!isLast ? (
                  <div className={cn("my-1 w-px flex-1", isCompleted ? "bg-primary/60" : "bg-border")} />
                ) : null}
              </div>
              <div className="min-h-12 pb-3">
                <p className={cn("text-sm font-semibold", isActive ? "text-primary" : "text-foreground")}>
                  {getMaintenanceStatusLabel(status)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {date ?? (isActive ? "Current status" : "Not reached yet")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="hidden overflow-hidden rounded-md border bg-card p-1 md:block"
        aria-label={`Ticket status: ${getMaintenanceStatusLabel(maintenance.status)}`}
      >
        <div className="flex" role="list">
          {statusSteps.map((step, index) => {
            const isActive = index === activeIndex;
            const isCompleted = index < activeIndex;
            const backgroundColor = isActive
              ? stepperColors.active
              : isCompleted
                ? stepperColors.complete
                : stepperColors.idle;
            const textColor = isActive
              ? "#FFFFFF"
              : isCompleted
                ? "#087443"
                : "#64748B";

            return (
              <div
                key={step}
                role="listitem"
                style={{
                  backgroundColor,
                  color: textColor,
                  marginLeft: index === 0 ? 0 : 4,
                  paddingLeft: index === 0 ? 6 : 15,
                  paddingRight: index === statusSteps.length - 1 ? 6 : 16,
                  zIndex: statusSteps.length - index,
                }}
                className="relative flex h-10 flex-1 items-center justify-center text-center text-[11px] font-bold"
              >
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-0 z-3 size-0"
                    style={{
                      borderTop: "20px solid transparent",
                      borderBottom: "20px solid transparent",
                      borderLeft: `18px solid ${stepperColors.divider}`,
                    }}
                  />
                ) : null}
                {index < statusSteps.length - 1 ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 right-[-1px] bottom-0 z-3 w-0.75"
                      style={{ backgroundColor }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 -right-4.5 z-4 size-0"
                      style={{
                        borderTop: "20px solid transparent",
                        borderBottom: "20px solid transparent",
                        borderLeft: `18px solid ${backgroundColor}`,
                      }}
                    />
                  </>
                ) : null}
                {step}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const SectionHeader = ({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-foreground md:text-lg">{title}</h2>
      {detail ? <span className="text-xs text-muted-foreground">{detail}</span> : null}
    </div>
  );
};

const ContentSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
};

const DetailField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

const SnapshotRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
};

const getStepperDate = (maintenance: Maintenance, status: Maintenance["status"]) => {
  if (MAINTENANCE_STATUS_ORDER.indexOf(status) > MAINTENANCE_STATUS_ORDER.indexOf(maintenance.status)) {
    return undefined;
  }

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

export default ViewMaintenance;

