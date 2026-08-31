import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import {
  formatMaintenanceDateTimeLabel,
  getMaintenancePriorityAccentClassName,
  getMaintenancePriorityChipClassName,
  getMaintenanceStatusChipClassName,
  getMaintenanceStatusLabel,
} from "@/components/pageComponents/Staff/Maintenance/maintenanceDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssignedMaintenanceById,
  useCompleteAssignedMaintenance,
  useReopenAssignedMaintenance,
  useStartAssignedMaintenance,
} from "@/hooks/staff/maintenance.hook";
import { cn } from "@/lib/utils";
import type {
  AssignedMaintenanceDetail,
  MaintenanceStatus,
} from "@/types/staff/maintenance.type";
import { AlertTriangle, ArrowLeft, Check, ImageIcon, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const TicketDetail = () => {
  const navigate = useNavigate();
  const { id, scope } = useParams();
  const query = useAssignedMaintenanceById(id);
  const start = useStartAssignedMaintenance();
  const complete = useCompleteAssignedMaintenance(id || "");
  const reopen = useReopenAssignedMaintenance();
  const [notes, setNotes] = useState("");
  const [proofs, setProofs] = useState<string[]>([]);
  const goBack = () =>
    navigate(
      scope === "history"
        ? "/staff/maintenance/history"
        : "/staff/maintenance/assigned",
    );

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="h-9 w-40 animate-pulse rounded bg-muted" />
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-52 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <section className="py-12 text-center">
        <AlertTriangle className="mx-auto size-6 text-destructive" />
        <h1 className="mt-3 font-semibold">Maintenance ticket not found</h1>
        <Button variant="outline" className="mt-4" onClick={goBack}>
          Go back
        </Button>
      </section>
    );
  }

  const ticket = query.data;
  const submitCompletion = () => {
    if (!notes.trim() || !proofs.length) return;
    complete.mutate({
      resolutionNotes: notes.trim(),
      resolutionProofImages: proofs,
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div className="space-y-3">
        <button
          type="button"
          onClick={goBack}
          className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to {scope === "history" ? "history" : "assigned tickets"}
        </button>
        <header>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ticket details
          </h1>
          <p className="mt-1 break-all text-sm text-muted-foreground">
            Ticket ID: {ticket.id}
          </p>
        </header>
        <MaintenanceStatusStepper status={ticket.status} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-5">
          <TicketInformation ticket={ticket} />
          <div className="xl:hidden">
            <MaintenanceTimeline ticket={ticket} />
          </div>
          {ticket.report?.booking ? <LinkedContext ticket={ticket} /> : null}
          {ticket.imagesUrl?.length ? (
            <ImageGallery title="Issue photos" images={ticket.imagesUrl} />
          ) : null}
          {ticket.status === "Pending" ? (
            <div className="xl:hidden">
              <StartMaintenanceAction
                isPending={start.isPending}
                onStart={() => start.mutate(ticket.id)}
              />
            </div>
          ) : null}
          {ticket.status === "InProgress" ? (
            <CompletionForm
              notes={notes}
              proofs={proofs}
              isPending={complete.isPending}
              onNotesChange={setNotes}
              onProofsChange={setProofs}
              onSubmit={submitCompletion}
            />
          ) : null}
          {ticket.status === "Completed" ? (
            <ObservationAction
              isPending={reopen.isPending}
              onReopen={() => reopen.mutate(ticket.id)}
            />
          ) : null}
          {ticket.resolutionNotes ? (
            <ResolutionDetails ticket={ticket} />
          ) : null}
        </main>

        <aside className="space-y-5 xl:sticky xl:top-6">
          <QuickSnapshot ticket={ticket} />
          <div className="hidden xl:block">
            <MaintenanceTimeline ticket={ticket} />
          </div>
          {ticket.status === "Pending" ? (
            <div className="hidden xl:block">
              <StartMaintenanceAction
                isPending={start.isPending}
                onStart={() => start.mutate(ticket.id)}
              />
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

const TicketInformation = ({
  ticket,
}: {
  ticket: AssignedMaintenanceDetail;
}) => (
  <section className="relative overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-sm">
    <span
      className={cn(
        "absolute inset-y-0 left-0 w-1",
        getMaintenancePriorityAccentClassName(ticket.priority),
      )}
    />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Maintenance request
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {ticket.title}
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge
          className={cn(
            "border",
            getMaintenancePriorityChipClassName(ticket.priority),
          )}
        >
          {ticket.priority} Priority
        </Badge>
        <Badge
          className={cn(
            "border",
            getMaintenanceStatusChipClassName(ticket.status),
          )}
        >
          {getMaintenanceStatusLabel(ticket.status)}
        </Badge>
      </div>
    </div>
    <div className="my-5 border-t" />
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Description
      </p>
      <p className="max-w-3xl text-sm leading-6 text-foreground/90">
        {ticket.description}
      </p>
    </div>
  </section>
);

const QuickSnapshot = ({ ticket }: { ticket: AssignedMaintenanceDetail }) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Ticket snapshot</h2>
    <div className="mt-4 space-y-3 text-sm">
      <SnapshotRow
        label="Status"
        value={getMaintenanceStatusLabel(ticket.status)}
      />
      <SnapshotRow label="Priority" value={`${ticket.priority} priority`} />
      <SnapshotRow label="Expertise" value={ticket.expertise} />
      <SnapshotRow label="Assigned to" value="You" />
    </div>
  </section>
);

const SnapshotRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-semibold text-foreground">{value}</span>
  </div>
);

const LinkedContext = ({ ticket }: { ticket: AssignedMaintenanceDetail }) => {
  const booking = ticket.report?.booking;
  if (!booking) return null;
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="font-bold">Linked context</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Guest", booking.guestName],
          ["Location", booking.accommodation.name],
          ["Booking reference", booking.referenceCode],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const StartMaintenanceAction = ({
  isPending,
  onStart,
}: {
  isPending: boolean;
  onStart: () => void;
}) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="font-bold">Ready to begin?</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">
      Start the ticket when you begin work so its status and timeline stay
      accurate.
    </p>
    <Button className="mt-4 w-full" disabled={isPending} onClick={onStart}>
      <Play className="size-4" />
      {isPending ? "Starting..." : "Start maintenance"}
    </Button>
  </section>
);

const CompletionForm = ({
  notes,
  proofs,
  isPending,
  onNotesChange,
  onProofsChange,
  onSubmit,
}: {
  notes: string;
  proofs: string[];
  isPending: boolean;
  onNotesChange: (value: string) => void;
  onProofsChange: (value: string[]) => void;
  onSubmit: () => void;
}) => (
  <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
    <div>
      <h2 className="text-lg font-bold">Update progress</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a clear resolution note and at least one proof photo.
      </p>
    </div>
    <Textarea
      value={notes}
      onChange={(event) => onNotesChange(event.target.value)}
      placeholder="Describe actions taken..."
      className="min-h-32"
    />
    <CloudinaryUpload
      purpose="MAINTENANCE_RESOLUTION"
      onSuccess={(url) => onProofsChange([...proofs, url])}
    />
    <CloudinaryPreview
      images={proofs.map((url) => ({ url }))}
      onRemove={(index) =>
        onProofsChange(
          proofs.filter((_, currentIndex) => currentIndex !== index),
        )
      }
    />
    <Button
      className="w-full"
      disabled={isPending || !notes.trim() || !proofs.length}
      onClick={onSubmit}
    >
      <Check className="size-4" />
      {isPending ? "Completing..." : "Mark as completed"}
    </Button>
  </section>
);

const ObservationAction = ({
  isPending,
  onReopen,
}: {
  isPending: boolean;
  onReopen: () => void;
}) => (
  <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
    <h2 className="font-bold text-amber-950">Seven-day observation period</h2>
    <p className="mt-2 text-sm leading-6 text-amber-900">
      This ticket will close automatically seven days after completion. Reopen it if the problem returns or was not fully fixed.
    </p>
    <Button className="mt-4 w-full" variant="outline" disabled={isPending} onClick={onReopen}>
      <RotateCcw className="size-4" />
      {isPending ? "Reopening..." : "Reopen ticket"}
    </Button>
  </section>
);

const ResolutionDetails = ({
  ticket,
}: {
  ticket: AssignedMaintenanceDetail;
}) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Resolution details</h2>
    <p className="mt-3 text-sm leading-6 text-foreground/90">
      {ticket.resolutionNotes}
    </p>
    {ticket.resolutionProofImages?.length ? (
      <div className="mt-5">
        <ImageGallery
          title="Resolution proof"
          images={ticket.resolutionProofImages}
          embedded
        />
      </div>
    ) : (
      <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
        No proof photos attached.
      </p>
    )}
  </section>
);

const statusSteps = ["Pending", "Started", "Done", "Closed"] as const;
const statusOrder: MaintenanceStatus[] = [
  "Pending",
  "InProgress",
  "Completed",
  "Closed",
];
const stepperColors = {
  active: "#0E33F3",
  complete: "#DDFBEF",
  idle: "#EEF2F6",
  divider: "#FFFFFF",
} as const;

const MaintenanceStatusStepper = ({
  status,
}: {
  status: MaintenanceStatus;
}) => {
  const currentStepIndex = statusOrder.indexOf(status);
  return (
    <div
      className="overflow-hidden rounded-md border bg-card p-1"
      aria-label={`Ticket status: ${getMaintenanceStatusLabel(status)}`}
    >
      <div className="flex" role="list">
        {statusSteps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isComplete = index < currentStepIndex;
          const backgroundColor = isActive
            ? stepperColors.active
            : isComplete
              ? stepperColors.complete
              : stepperColors.idle;
          const textColor = isActive
            ? "#FFFFFF"
            : isComplete
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
  );
};

const MaintenanceTimeline = ({
  ticket,
}: {
  ticket: Pick<
    AssignedMaintenanceDetail,
    "createdAt" | "startedAt" | "resolvedAt" | "closedAt"
  >;
}) => {
  const rows = [
    {
      label: "Ticket created",
      value: formatMaintenanceDateTimeLabel(ticket.createdAt),
      complete: true,
    },
    {
      label: "Work started",
      value: ticket.startedAt
        ? formatMaintenanceDateTimeLabel(ticket.startedAt)
        : "Not started yet",
      complete: Boolean(ticket.startedAt),
    },
    {
      label: "Resolved",
      value: ticket.resolvedAt
        ? formatMaintenanceDateTimeLabel(ticket.resolvedAt)
        : "Not resolved yet",
      complete: Boolean(ticket.resolvedAt),
    },
    {
      label: "Closed",
      value: ticket.closedAt
        ? formatMaintenanceDateTimeLabel(ticket.closedAt)
        : "Not closed yet",
      complete: Boolean(ticket.closedAt),
    },
  ];
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">Timeline</h2>
      <div className="mt-4">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className="relative flex min-h-9 items-start gap-3 pb-5 last:pb-0"
          >
            {index < rows.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-3 left-[4px] -bottom-2.5 z-0 w-px bg-border"
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 mt-1 size-2.5 shrink-0 rounded-full ring-4 ring-card",
                row.complete ? "bg-primary" : "bg-muted",
              )}
            />
            <p
              className={cn(
                "relative z-10 flex-1 text-sm font-semibold",
                !row.complete && "text-muted-foreground",
              )}
            >
              {row.label}
            </p>
            <p
              className={cn(
                "relative z-10 max-w-[48%] text-right text-sm font-semibold",
                !row.complete ? "text-muted-foreground" : "text-foreground/75",
              )}
            >
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ImageGallery = ({
  title,
  images,
  embedded = false,
}: {
  title: string;
  images: string[];
  embedded?: boolean;
}) => (
  <section
    className={embedded ? "" : "rounded-xl border bg-card p-5 shadow-sm"}
  >
    <h2 className="flex items-center gap-2 font-bold">
      <ImageIcon className="size-4" />
      {title}
    </h2>
    <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4">
      {images.slice(0, 4).map((url, index) => (
        <ViewPhotoDialog
          key={`${url}-${index}`}
          imageUrl={url}
          imgOptions={{ alt: `${title} ${index + 1}` }}
        >
          <button
            type="button"
            className="overflow-hidden rounded-lg bg-muted text-left transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src={url}
              alt={`${title} ${index + 1}`}
              className="aspect-square w-full object-cover"
            />
          </button>
        </ViewPhotoDialog>
      ))}
    </div>
  </section>
);

export default TicketDetail;
