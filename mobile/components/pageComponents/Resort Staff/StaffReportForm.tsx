import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/Button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useCreateStaffReport } from "@/hooks/staffReports.hook";
import { toast } from "@/lib/toast";
import type {
  ReportSeverity,
  ReportType,
} from "@/types/staffReport.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { reportTypeLabels } from "./reportDisplay";

const reportSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(400, "Description must be at most 400 characters"),
  severity: z.enum(["Low", "Medium", "High"]),
  type: z.enum(["checkIn", "checkOut", "maintenance"]),
  proofImages: z
    .array(z.string().url())
    .min(1, "Add at least one proof image")
    .max(3, "You can attach up to three proof images"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

type StaffReportFormProps = {
  bookingId?: string;
  initialType?: ReportType;
  onCreated: (reportId: string) => void;
};

export default function StaffReportForm({
  bookingId,
  initialType,
  onCreated,
}: StaffReportFormProps) {
  const createReport = useCreateStaffReport();
  const isTypeLocked = Boolean(bookingId && initialType);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "Low",
      type: bookingId ? initialType ?? "checkIn" : "maintenance",
      proofImages: [],
    },
  });

  const submit = async (values: ReportFormValues) => {
    if (!bookingId && values.type !== "maintenance") {
      toast.error("Check-in and check-out reports require a booking.");
      return;
    }

    try {
      const report = await createReport.mutateAsync({
        bookingId,
        title: values.title.trim(),
        description: values.description.trim(),
        severity: values.severity as ReportSeverity,
        type: values.type,
        proofImages: values.proofImages,
      });
      onCreated(report.id);
    } catch {}
  };

  const isSubmitting = createReport.isPending;

  return (
    <View className="gap-5">
      {isTypeLocked && initialType ? (
        <View className="rounded-2xl bg-secondary-blue-light px-4 py-3">
          <Text className="font-sans-semibold text-base text-neutral-dark-1">
            {reportTypeLabels[initialType]} report
          </Text>
          <Text className="mt-1 text-base text-neutral-grey-1">
            This report will be linked to booking {bookingId}.
          </Text>
        </View>
      ) : bookingId ? (
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Field>
              <FieldLabel>Report type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger />
                <SelectContent>
                  {(["checkIn", "checkOut", "maintenance"] as ReportType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {reportTypeLabels[type]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FieldError errors={errors.type ? [{ message: errors.type.message }] : []} />
            </Field>
          )}
        />
      ) : (
        <View className="rounded-2xl bg-secondary-blue-light px-4 py-3">
          <Text className="font-sans-semibold text-base text-neutral-dark-1">
            General maintenance report
          </Text>
          <Text className="mt-1 text-base text-neutral-grey-1">
            This report is not linked to a guest booking.
          </Text>
        </View>
      )}

      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Example: Broken poolside light"
              invalid={Boolean(errors.title)}
              editable={!isSubmitting}
            />
            <FieldError errors={errors.title ? [{ message: errors.title.message }] : []} />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Field>
            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Describe what happened and what needs attention."
              placeholderTextColor="#9FA8B1"
              multiline
              textAlignVertical="top"
              maxLength={400}
              editable={!isSubmitting}
              className={`min-h-32 rounded-xl border bg-neutral-soft-grey-3 px-4 py-3 text-lg text-neutral-dark-1 ${
                errors.description ? "border-system-red" : "border-neutral-soft-grey-1"
              }`}
            />
            <View className="flex-row justify-between gap-3">
              <FieldError
                className="flex-1"
                errors={
                  errors.description ? [{ message: errors.description.message }] : []
                }
              />
              <Text className="text-sm text-neutral-grey-1">
                {field.value.length}/400
              </Text>
            </View>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="severity"
        render={({ field }) => (
          <Field>
            <FieldLabel>Severity</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger />
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <FieldError
              errors={errors.severity ? [{ message: errors.severity.message }] : []}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="proofImages"
        render={({ field }) => (
          <Field>
            <FieldLabel>Proof photos</FieldLabel>
            <FieldDescription>Attach 1 to 3 clear photos.</FieldDescription>

            {field.value.length < 3 ? (
              <CloudinaryUpload
                disabled={isSubmitting}
                onSuccess={(url) => field.onChange([...field.value, url])}
                onError={(error) => toast.error(error.message)}
              />
            ) : null}

            <CloudinaryPreview
              images={field.value}
              disabled={isSubmitting}
              onRemove={(index) =>
                field.onChange(
                  field.value.filter((_, imageIndex) => imageIndex !== index),
                )
              }
            />

            <FieldError
              errors={
                errors.proofImages
                  ? [{ message: errors.proofImages.message }]
                  : []
              }
            />
          </Field>
        )}
      />

      <Button
        size="lg"
        disabled={isSubmitting}
        onPress={handleSubmit(submit)}
      >
        {isSubmitting ? (
          <>
            <ActivityIndicator color="#FFFFFF" />
            <Text className="font-sans-semibold text-lg text-white">
              Submitting...
            </Text>
          </>
        ) : (
          <Text className="font-sans-semibold text-lg text-white">
            Submit report
          </Text>
        )}
      </Button>
    </View>
  );
}
