import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateResortReport } from "@/features/staff/resort/hooks/useStaffResort";
import type { ReportSeverity, ReportType } from "@/features/staff/resort/types/staffResort.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CheckCircle2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { reportTypeLabels } from "../components/resortDisplay";

const severityOptions: { value: ReportSeverity; hint: string; className: string }[] = [
  { value: "Low", hint: "Minor issue", className: "border-primary bg-blue-50" },
  { value: "Medium", hint: "Needs attention", className: "border-amber-400 bg-amber-50" },
  { value: "High", hint: "Urgent risk", className: "border-red-400 bg-red-50" },
];
const reportSchema = z.object({
  title: z.string().trim().min(1, "Add a clear report title."),
  description: z.string().trim().min(1, "Description is required."),
  severity: z.enum(["Low", "Medium", "High"]),
  proofImages: z.array(z.string().url("Invalid proof image.")).min(1, "Add at least one proof image.").max(3, "You can attach up to three proof images."),
});
type ReportFormValues = z.infer<typeof reportSchema>;
type ReportFormProps = { bookingId?: string; initialType?: ReportType; onCreated: (id: string) => void };

const ReportForm = ({ bookingId, initialType = "maintenance", onCreated }: ReportFormProps) => {
  const create = useCreateResortReport();
  const typeLocked = Boolean(bookingId);
  const { register, handleSubmit, setError, clearErrors, setValue, control, formState: { errors } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { title: "", description: "", severity: "Low", proofImages: [] },
    criteriaMode: "all",
  });
  const severity = useWatch({ control, name: "severity" });
  const proofImages = useWatch({ control, name: "proofImages" });
  const submit = (data: ReportFormValues) => create.mutate(
    { bookingId, title: data.title, description: data.description, severity: data.severity, type: initialType, proofImages: data.proofImages },
    { onSuccess: (report) => onCreated(report.id) },
  );

  return (
    <form className="w-full max-w-3xl space-y-5" onSubmit={handleSubmit(submit)}>
      <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <p className="font-semibold">{typeLocked ? `${reportTypeLabels[initialType]} report` : "General maintenance report"}</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{typeLocked ? `This report is linked to booking ${bookingId}.` : "This report is not linked to a guest booking."}</p>
      </section>
      <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="border-b pb-3"><h2 className="text-lg font-bold">Report details</h2><p className="mt-1 text-sm text-muted-foreground">Keep it clear so admin can review quickly.</p></div>
        <label className="grid gap-2 text-sm font-semibold">Title
          <Input {...register("title")} disabled={create.isPending} aria-invalid={Boolean(errors.title)} placeholder="Example: Pool area tile repair" className="font-normal placeholder:font-normal" />
          {errors.title ? <p role="alert" className="text-sm font-medium text-destructive">{errors.title.message}</p> : null}
        </label>
        <label className="grid gap-2 text-sm font-semibold">Description
          <Textarea {...register("description")} disabled={create.isPending} aria-invalid={Boolean(errors.description)} placeholder="Describe what happened and what needs attention." className="min-h-32 font-normal placeholder:font-normal" />
          {errors.description ? <p role="alert" className="text-sm font-medium text-destructive">{errors.description.message}</p> : null}
        </label>
      </section>
      <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="border-b pb-3"><h2 className="text-lg font-bold">Severity</h2><p className="mt-1 text-sm text-muted-foreground">Choose how urgently this needs attention.</p></div>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Severity">
          {severityOptions.map((option) => {
            const selected = severity === option.value;
            return <button type="button" key={option.value} disabled={create.isPending} onClick={() => setValue("severity", option.value, { shouldValidate: true })} aria-pressed={selected} className={`min-h-20 rounded-lg border p-3 text-left ${selected ? option.className : "bg-background"}`}>
              <span className="flex items-center gap-1.5 font-semibold">{selected ? <CheckCircle2 className="size-4" /> : null}{option.value}</span><span className="mt-1 block text-xs text-muted-foreground">{option.hint}</span>
            </button>;
          })}
        </div>
      </section>
      <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b pb-3"><div><h2 className="text-lg font-bold">Proof photos</h2><p className="mt-1 text-sm text-muted-foreground">Attach 1 to 3 clear photos.</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">1 to 3</span></div>
        {proofImages.length < 3 ? <CloudinaryUpload purpose="STAFF_REPORT_PROOF" onSuccess={(url) => { clearErrors("proofImages"); setValue("proofImages", [...proofImages, url], { shouldValidate: true }); }} onError={(error) => { toast.error(error.message || "Image upload failed. Please try again."); setError("proofImages", { type: "server", message: "Image upload failed. Please try again." }); }} /> : null}
        <CloudinaryPreview images={proofImages.map((url) => ({ url }))} onRemove={(index) => setValue("proofImages", proofImages.filter((_, itemIndex) => itemIndex !== index), { shouldValidate: true })} />
        {errors.proofImages ? <p role="alert" className="text-sm font-medium text-destructive">{errors.proofImages.message}</p> : null}
        <p className="flex items-center gap-2 rounded-md bg-muted/60 p-3 text-sm text-muted-foreground"><Camera className="size-4" />Photos help admin verify the concern faster.</p>
      </section>
      <Button type="submit" className="h-11 w-full lg:h-9 lg:w-auto" disabled={create.isPending} aria-label={create.isPending ? "Submitting report" : undefined}>{create.isPending ? <LoadingSpinner className="size-4" /> : "Submit report"}</Button>
    </form>
  );
};
export default ReportForm;
