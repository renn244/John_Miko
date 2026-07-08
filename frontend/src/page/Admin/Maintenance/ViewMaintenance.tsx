import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import MarkCompleteDialog from "@/components/pageComponents/Admin/Maintenance/MarkCompleteDialog";
import {
  formatMaintenanceDateTime,
  formatMaintenanceShortDate,
  getMaintenanceAssigneeLabel,
  getMaintenancePriorityClasses,
  getMaintenanceStatusClasses,
  getMaintenanceStatusLabel,
  MAINTENANCE_STATUS_ORDER,
} from "@/components/pageComponents/Admin/Maintenance/maintenanceDisplay";
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
  ArrowLeft,
  Check,
  Clock3,
  Edit,
  ImageIcon,
  Lock,
  type LucideIcon,
  Play,
  Sparkles,
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
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div className="space-y-3">
        <Link
          to="/admin/maintenance"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Maintenance Board
        </Link>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Maintenance Details</h1>
            <p className="mt-1 break-all text-sm text-muted-foreground">{maintenance.id}</p>
          </div>
        </div>

        <MaintenanceStepper maintenance={maintenance} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
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
              <SectionHeader title="Attached Media" icon={ImageIcon} />

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
              <SectionHeader title="Resolution Proof" icon={Sparkles} />

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

        <div className="space-y-5 xl:sticky xl:top-6">
          <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <SectionHeader title="Quick Snapshot" />

            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2 border-b pb-3">
                <Badge className={cn("border", getMaintenanceStatusClasses(maintenance.status))}>
                  {getMaintenanceStatusLabel(maintenance.status)}
                </Badge>
                <Badge className={cn("border", getMaintenancePriorityClasses(maintenance.priority))}>
                  {maintenance.priority} Priority
                </Badge>
              </div>
              <SnapshotRow label="Expertise" value={maintenance.expertise} />
              <SnapshotRow label="Assigned" value={getMaintenanceAssigneeLabel(maintenance)} />
            </div>
          </Card>

          <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
            <SectionHeader title="Activity" icon={Clock3} />

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

const STEP_CHEVRON_SIZE = 12;
const FIRST_STEP_CLIP =
  `polygon(calc(100% - ${STEP_CHEVRON_SIZE}px) 0%, 100% 50%, calc(100% - ${STEP_CHEVRON_SIZE}px) 100%, 0% 100%, ${STEP_CHEVRON_SIZE}px 50%, 0% 0%)`;
const CONNECTED_STEP_CLIP =
  `polygon(calc(100% - ${STEP_CHEVRON_SIZE}px) 0%, 100% 50%, calc(100% - ${STEP_CHEVRON_SIZE}px) 100%, 0% 100%, ${STEP_CHEVRON_SIZE}px 50%, 0% 0%)`;

const MaintenanceStepper = ({ maintenance }: { maintenance: Maintenance }) => {
  const activeIndex = MAINTENANCE_STATUS_ORDER.indexOf(maintenance.status);

  return (
    <div className="overflow-x-auto px-4">
      <div className="mx-auto flex h-10 min-w-[720px] items-stretch overflow-hidden bg-card">
        {MAINTENANCE_STATUS_ORDER.map((status, index) => {
          const isActive = maintenance.status === status;
          const isCompleted = activeIndex > index;
          const isFirst = index === 0;
          const clipPath = isFirst ? FIRST_STEP_CLIP : CONNECTED_STEP_CLIP;

          return (
            <div
              key={status}
              className={cn(
                "relative flex flex-1 items-center gap-2 pl-6",
                index === MAINTENANCE_STATUS_ORDER.length - 1 ? "pr-4" : "pr-6",
              )}
              style={{
                marginLeft: isFirst ? 0 : `-${STEP_CHEVRON_SIZE}px`,
                zIndex: isActive ? 20 : MAINTENANCE_STATUS_ORDER.length - index,
              }}
            >
              <div
                className={cn(
                  "absolute inset-0",
                  isActive
                    ? "bg-primary"
                    : isCompleted
                      ? "bg-primary/50"
                      : "bg-border",
                )}
                style={{ clipPath }}
              />

              <div
                className={cn(
                  "absolute inset-px",
                  isActive
                    ? "bg-primary shadow-lg"
                    : isCompleted
                      ? "bg-primary/35"
                      : "bg-card",
                )}
                style={{ clipPath }}
              />

              <div className="relative flex items-baseline gap-2 leading-none">
                <div
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-white text-primary"
                      : isCompleted
                        ? "bg-primary text-white"
                        : "border border-border bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="size-3" /> : index + 1}
                </div>

                <div className="flex items-baseline gap-2 leading-none">
                  <span
                    className={cn(
                      "text-[11px] font-bold",
                      isActive ? "text-white" : isCompleted ? "text-primary" : "text-foreground",
                    )}
                  >
                    {getMaintenanceStatusLabel(status)}
                  </span>
                  <span className={cn("text-[10px]", isActive ? "text-white/80" : "text-muted-foreground")}>
                    {getStepperDate(maintenance, status) ?? "Pending"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SectionHeader = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: LucideIcon;
}) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      {Icon ? <Icon className="size-5 text-primary" /> : null}
      <h2 className="text-base font-semibold text-foreground md:text-lg">{title}</h2>
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

