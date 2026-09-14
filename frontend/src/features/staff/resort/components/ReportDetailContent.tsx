import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import type { StaffReport } from "@/features/staff/resort/types/staffResort.type";
import { CalendarDays, ImageIcon, MapPin } from "lucide-react";
import {
  formatResortDate,
  reportAccent,
  reportReference,
  reportStatusClass,
  reportTypeLabels,
} from "./resortDisplay";

const ReportDetailContent = ({ report }: { report: StaffReport }) => (
  <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
    <main className="min-w-0 space-y-5">
      <ReportInformation report={report} />
      <ReportBody report={report} />
      <ReviewOutcome report={report} />
      <div className="xl:hidden">
        <LinkedBooking report={report} />
      </div>
      <ProofImages report={report} />
    </main>

    <aside className="space-y-5 xl:sticky xl:top-6">
      <ReportSnapshot report={report} />
      <div className="hidden xl:block">
        <LinkedBooking report={report} />
      </div>
    </aside>
  </div>
);

const ReportInformation = ({ report }: { report: StaffReport }) => (
  <section className="relative overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-sm">
    <span
      aria-hidden="true"
      className={`absolute inset-y-0 left-0 w-1 ${reportAccent[report.status]}`}
    />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {reportReference(report.id)} · {reportTypeLabels[report.type]}
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {report.title}
        </h2>
      </div>
      <span
        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${reportStatusClass[report.status]}`}
      >
        {report.status}
      </span>
    </div>
    <div className="mt-5 flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
      <CalendarDays className="size-4" />
      {formatResortDate(report.createdAt, true)}
    </div>
  </section>
);

const ReportSnapshot = ({ report }: { report: StaffReport }) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Report snapshot</h2>
    <div className="mt-4 space-y-3 text-sm">
      <SnapshotRow label="Status" value={report.status} />
      <SnapshotRow label="Type" value={reportTypeLabels[report.type]} />
      <SnapshotRow label="Severity" value={`${report.severity} severity`} />
      <SnapshotRow
        label="Submitted"
        value={formatResortDate(report.createdAt, true)}
      />
      <SnapshotRow
        label="Photos"
        value={`${report.proofImages.length} attached`}
      />
    </div>
  </section>
);

const SnapshotRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-semibold text-foreground">{value}</span>
  </div>
);

const ReportBody = ({ report }: { report: StaffReport }) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Report details</h2>
    <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/90">
      {report.description}
    </p>
  </section>
);

const ReviewOutcome = ({ report }: { report: StaffReport }) => {
  const isRejected = report.status === "Rejected";
  const title = isRejected ? "Rejection note" : "Review outcome";
  const description = isRejected
    ? report.rejectionNote || "No rejection note was provided."
    : report.status === "Approved"
      ? `This report was approved${report.reviewedAt ? ` on ${formatResortDate(report.reviewedAt, true)}` : "."}`
      : "This report is waiting for admin review.";

  return (
    <section
      className={`rounded-xl border p-5 ${isRejected ? "border-red-200 bg-red-50" : "bg-card"}`}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
};

const LinkedBooking = ({ report }: { report: StaffReport }) =>
  report.booking ? (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">Linked booking</h2>
      <div className="mt-4 rounded-lg bg-muted/60 p-3">
        <p className="font-semibold text-foreground">
          {report.booking.guestName}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {report.booking.referenceCode}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          {report.booking.accommodation.name} ·{" "}
          {formatResortDate(report.booking.bookingDate)}
        </p>
      </div>
    </section>
  ) : (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">General resort report</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This report is not connected to a guest booking.
      </p>
    </section>
  );

const ProofImages = ({ report }: { report: StaffReport }) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="flex items-center gap-2 text-lg font-bold">
      <ImageIcon className="size-4" />
      Proof images
    </h2>
    {report.proofImages.length ? (
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {report.proofImages.map((url, index) => (
          <ViewPhotoDialog
            key={url}
            imageUrl={url}
            imgOptions={{ alt: `Proof image ${index + 1}` }}
          >
            <button
              type="button"
              className="overflow-hidden rounded-lg bg-muted text-left transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src={url}
                alt={`Proof image ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </button>
          </ViewPhotoDialog>
        ))}
      </div>
    ) : (
      <p className="mt-4 text-sm text-muted-foreground">
        No proof images attached.
      </p>
    )}
  </section>
);

export default ReportDetailContent;
