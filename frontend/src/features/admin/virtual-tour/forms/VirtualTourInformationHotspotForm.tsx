import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import type { AdminVirtualTourHotspot } from "@/features/admin/virtual-tour/types/virtual-tour.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const InformationHotspotSchema = z.object({
  label: z.string().min(1, "Hotspot label is required").max(120),
  infoTitle: z.string().min(1, "Information title is required").max(160),
  infoDescription: z
    .string()
    .min(1, "Information description is required")
    .max(4000),
  infoImageUrl: z.url("Invalid image URL").nullable(),
  isActive: z.boolean(),
});

export type InformationHotspotFormValues = z.infer<
  typeof InformationHotspotSchema
>;

type InformationHotspotFormProps = {
  hotspot: AdminVirtualTourHotspot | null;
  disabled: boolean;
  onDirtyChange: (dirty: boolean) => void;
  onsubmit: (data: InformationHotspotFormValues) => Promise<void>;
};

const VirtualTourInformationHotspotForm = ({
  hotspot,
  disabled,
  onDirtyChange,
  onsubmit,
}: InformationHotspotFormProps) => {
  const isUpdate = Boolean(hotspot);
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, isSubmitting },
  } = useForm<InformationHotspotFormValues>({
    resolver: zodResolver(InformationHotspotSchema),
    defaultValues: {
      label: hotspot?.label || "",
      infoTitle: hotspot?.infoTitle || "",
      infoDescription: hotspot?.infoDescription || "",
      infoImageUrl: hotspot?.infoImageUrl || null,
      isActive: hotspot?.isActive ?? true,
    },
    criteriaMode: "all",
  });

  useEffect(() => {
    onDirtyChange(!isUpdate || isDirty);
  }, [isDirty, isUpdate, onDirtyChange]);

  const onSubmit = async (data: InformationHotspotFormValues) => {
    try {
      await onsubmit(data);
      reset(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        handleNestError(error.response, setError);
        return;
      }
      toast.error(
        error instanceof Error ? error.message : "Unable to save the hotspot.",
      );
    }
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="label"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="grid gap-2">
            <FieldLabel htmlFor={field.name}>Label</FieldLabel>
            <Input
              {...field}
              id={field.name}
              maxLength={120}
              placeholder="e.g. Pool information"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid ? (
              <FieldError errors={getErrorMessages(fieldState.error)} />
            ) : null}
          </Field>
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Active hotspot</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Inactive hotspots stay hidden from guests.
              </p>
            </div>
            <Switch
              aria-label="Active hotspot"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />

      <Controller
        name="infoTitle"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="grid gap-2">
            <FieldLabel htmlFor={field.name}>Information title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              maxLength={160}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid ? (
              <FieldError errors={getErrorMessages(fieldState.error)} />
            ) : null}
          </Field>
        )}
      />

      <Controller
        name="infoDescription"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="grid gap-2">
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              maxLength={4000}
              rows={5}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid ? (
              <FieldError errors={getErrorMessages(fieldState.error)} />
            ) : null}
          </Field>
        )}
      />

      <Controller
        name="infoImageUrl"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="grid gap-2">
            <FieldLabel>Optional photo</FieldLabel>
            {field.value ? (
              <CloudinaryPreview
                images={[{ url: field.value }]}
                onRemove={() => field.onChange(null)}
                className="grid-cols-1"
                itemClassName="h-36 rounded-lg"
              />
            ) : (
              <CloudinaryUpload
                purpose="VIRTUAL_TOUR_INFO"
                onSuccess={field.onChange}
                onError={(error) =>
                  setError("infoImageUrl", {
                    type: "manual",
                    message: error.message,
                  })
                }
              />
            )}
            {fieldState.invalid ? (
              <FieldError errors={getErrorMessages(fieldState.error)} />
            ) : null}
          </Field>
        )}
      />

      <Button type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? <LoadingSpinner /> : <Save className="size-4" />}
        {isUpdate ? "Save hotspot" : "Create hotspot"}
      </Button>
    </form>
  );
};

export default VirtualTourInformationHotspotForm;
