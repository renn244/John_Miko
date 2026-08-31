import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateResortReport } from "@/hooks/staff/resort.hook";
import type { ReportSeverity, ReportType } from "@/types/staff/resort.type";
import { Camera, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { reportTypeLabels } from "./resortDisplay";

const severityOptions: {
  value: ReportSeverity;
  hint: string;
  className: string;
}[] = [
  { value: "Low", hint: "Minor issue", className: "border-primary bg-blue-50" },
  {
    value: "Medium",
    hint: "Needs attention",
    className: "border-amber-400 bg-amber-50",
  },
  { value: "High", hint: "Urgent risk", className: "border-red-400 bg-red-50" },
];

type ReportFormProps = {
  bookingId?: string;
  initialType?: ReportType;
  onCreated: (id: string) => void;
};

const ReportForm = ({
  bookingId,
  initialType = "maintenance",
  onCreated,
}: ReportFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<ReportSeverity>("Low");
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const create = useCreateResortReport();
  const typeLocked = Boolean(bookingId);

  const submit = () => {
    if (!title.trim()) return setError("Add a clear report title.");
    if (!description.trim()) {
      return setError("Description is required.");
    }
    if (!proofImages.length) return setError("Add at least one proof image.");

    setError("");
    create.mutate(
      {
        bookingId,
        title: title.trim(),
        description: description.trim(),
        severity,
        type: initialType,
        proofImages,
      },
      { onSuccess: (report) => onCreated(report.id) },
    );
  };

  return (
    <div className="w-full max-w-3xl space-y-5">
      <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <p className="font-semibold">
          {typeLocked
            ? `${reportTypeLabels[initialType]} report`
            : "General maintenance report"}
        </p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {typeLocked
            ? `This report is linked to booking ${bookingId}.`
            : "This report is not linked to a guest booking."}
        </p>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="border-b pb-3">
          <h2 className="text-lg font-bold">Report details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep it clear so admin can review quickly.
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold">
          Title
          <Input
            value={title}
            disabled={create.isPending}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Pool area tile repair"
            className="font-normal placeholder:font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Description
          <Textarea
            value={description}
            disabled={create.isPending}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe what happened and what needs attention."
            className="min-h-32 font-normal placeholder:font-normal"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="border-b pb-3">
          <h2 className="text-lg font-bold">Severity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how urgently this needs attention.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {severityOptions.map((option) => {
            const selected = severity === option.value;

            return (
              <button
                type="button"
                key={option.value}
                disabled={create.isPending}
                onClick={() => setSeverity(option.value)}
                className={`min-h-20 rounded-lg border p-3 text-left ${selected ? option.className : "bg-background"}`}
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  {selected ? <CheckCircle2 className="size-4" /> : null}
                  {option.value}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="text-lg font-bold">Proof photos</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Attach 1 to 3 clear photos.
            </p>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
            1 to 3
          </span>
        </div>
        {proofImages.length < 3 ? (
          <CloudinaryUpload
            purpose="STAFF_REPORT_PROOF"
            onSuccess={(url) => {
              setError("");
              setProofImages((items) => [...items, url]);
            }}
          />
        ) : null}
        <CloudinaryPreview
          images={proofImages.map((url) => ({ url }))}
          onRemove={(index) =>
            setProofImages((items) =>
              items.filter((_, itemIndex) => itemIndex !== index),
            )
          }
        />
        <p className="flex items-center gap-2 rounded-md bg-muted/60 p-3 text-sm text-muted-foreground">
          <Camera className="size-4" />
          Photos help admin verify the concern faster.
        </p>
      </section>

      {error ? (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        className="h-11 w-full lg:h-9 lg:w-auto"
        disabled={create.isPending}
        aria-label={create.isPending ? "Submitting report" : undefined}
        onClick={submit}
      >
        {create.isPending ? (
          <LoadingSpinner className="size-4" />
        ) : (
          "Submit report"
        )}
      </Button>
    </div>
  );
};

export default ReportForm;
