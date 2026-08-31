import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/Button";
import { useResortRoleTourTargets } from "@/hooks/roleTours/useResortRoleTourTargets";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import OperationalCard from "@/components/ui/operational-card";
import StatusChip from "@/components/ui/status-chip";
import { useCreateStaffReport } from "@/hooks/staffReports.hook";
import { toast } from "@/lib/toast";
import type { ReportSeverity, ReportType } from "@/types/staffReport.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CheckCircle2, TriangleAlert } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
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
    .min(1, "Description is required"),
  severity: z.enum(["Low", "Medium", "High"]),
  type: z.enum(["checkIn", "checkOut", "maintenance"]),
  proofImages: z
    .array(z.string().url())
    .min(1, "Add at least one proof image")
    .max(3, "You can attach up to three proof images"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

type StaffReportFormBaseProps = {
  onCreated: (reportId: string) => void;
};

type StaffReportFormProps = StaffReportFormBaseProps &
  (
    | {
        bookingId: string;
        initialType: ReportType;
      }
    | {
        bookingId?: never;
        initialType?: never;
      }
  );

const severityOptions: {
  value: ReportSeverity;
  label: string;
  hint: string;
  selectedClassName: string;
  iconColor: string;
}[] = [
  {
    value: "Low",
    label: "Low",
    hint: "Minor issue",
    selectedClassName: "border-primary bg-secondary-blue-light",
    iconColor: "#0E33F3",
  },
  {
    value: "Medium",
    label: "Medium",
    hint: "Needs attention",
    selectedClassName: "border-secondary-yellow bg-secondary-yellow-light",
    iconColor: "#9A5B00",
  },
  {
    value: "High",
    label: "High",
    hint: "Urgent risk",
    selectedClassName: "border-system-red bg-system-red/10",
    iconColor: "#AB091E",
  },
];

export default function StaffReportForm({
  bookingId,
  initialType,
  onCreated,
}: StaffReportFormProps) {
  const {
    reportDetailsTargetProps,
    reportProofPhotosTargetProps,
    reportSeverityTargetProps,
  } = useResortRoleTourTargets();
  const createReport = useCreateStaffReport();
  const isTypeLocked = bookingId !== undefined;
  const effectiveType = initialType ?? "maintenance";

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "Low",
      type: effectiveType,
      proofImages: [],
    },
  });
  const [isProofUploading, setIsProofUploading] = useState(false);

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
  const isFormBusy = isSubmitting || isProofUploading;
  const typeLabel = reportTypeLabels[effectiveType];

  return (
    <View className="gap-4">
      <View className="rounded-md border border-primary/20 bg-secondary-blue-light px-4 py-3">
        <Text className="font-sans-semibold text-base text-neutral-dark-1">
          {isTypeLocked ? `${typeLabel} report` : "General maintenance report"}
        </Text>
        <Text className="mt-1 text-base leading-5 text-neutral-grey-1">
          {isTypeLocked
            ? `This report is linked to booking ${bookingId}.`
            : "This report is not linked to a guest booking."}
        </Text>
      </View>

      <View {...reportDetailsTargetProps}>
        <OperationalCard contentClassName="gap-4 px-4 py-4">
          <View className="gap-1 border-b border-neutral-soft-grey-2 pb-3">
            <Text className="font-sans-bold text-xl text-neutral-dark-1">
              Report details
            </Text>
            <Text className="text-base text-neutral-grey-1">
              Keep it clear so admin can review quickly.
            </Text>
          </View>

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
                  placeholder="Example: Pool area tile repair"
                  invalid={Boolean(errors.title)}
                  editable={!isSubmitting}
                  surface="white"
                />
                <FieldError
                  errors={
                    errors.title ? [{ message: errors.title.message }] : []
                  }
                />
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
                  editable={!isSubmitting}
                  className={`min-h-32 rounded-lg border bg-white px-4 py-3 text-lg text-neutral-dark-1 ${
                    errors.description
                      ? "border-system-red"
                      : "border-neutral-soft-grey-1"
                  }`}
                />
                <FieldError
                  errors={
                    errors.description
                      ? [{ message: errors.description.message }]
                      : []
                  }
                />
              </Field>
            )}
          />
        </OperationalCard>
      </View>

      <View {...reportSeverityTargetProps}>
        <OperationalCard contentClassName="gap-4 px-4 py-4">
          <View className="gap-1 border-b border-neutral-soft-grey-2 pb-3">
            <Text className="font-sans-bold text-xl text-neutral-dark-1">
              Severity
            </Text>
            <Text className="text-base text-neutral-grey-1">
              Choose how urgently this needs attention.
            </Text>
          </View>

          <Controller
            control={control}
            name="severity"
            render={({ field }) => (
              <Field>
                <View className="flex-row gap-2">
                  {severityOptions.map((option) => {
                    const selected = field.value === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        disabled={isSubmitting}
                        onPress={() => field.onChange(option.value)}
                        className={`flex-1 gap-1 rounded-md border px-3 py-3 ${
                          selected
                            ? option.selectedClassName
                            : "border-neutral-soft-grey-1 bg-white"
                        } ${isSubmitting ? "opacity-50" : ""}`}
                      >
                        <View className="flex-row items-center gap-1.5">
                          {selected ? (
                            <CheckCircle2 size={14} color={option.iconColor} />
                          ) : null}
                          <Text className="font-sans-semibold text-base text-neutral-dark-1">
                            {option.label}
                          </Text>
                        </View>
                        <Text className="text-sm text-neutral-grey-1">
                          {option.hint}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <FieldError
                  errors={
                    errors.severity
                      ? [{ message: errors.severity.message }]
                      : []
                  }
                />
              </Field>
            )}
          />
        </OperationalCard>
      </View>

      <View {...reportProofPhotosTargetProps}>
        <OperationalCard
          className={errors.proofImages ? "border-system-red" : ""}
          leftAccentClassName={errors.proofImages ? "bg-system-red" : undefined}
          contentClassName="gap-4 px-4 py-4"
        >
          <View className="gap-1 border-b border-neutral-soft-grey-2 pb-3">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="font-sans-bold text-xl text-neutral-dark-1">
                Proof photos
              </Text>
              <StatusChip label="1 to 3" tone="neutral" size="sm" />
            </View>
            <FieldDescription>Attach 1 to 3 clear photos.</FieldDescription>
          </View>

          <Controller
            control={control}
            name="proofImages"
            render={({ field }) => (
              <Field>
                {field.value.length < 3 ? (
                  <CloudinaryUpload
                    purpose="STAFF_REPORT_PROOF"
                    disabled={isFormBusy}
                    onUploadingChange={setIsProofUploading}
                    onSuccess={(url) =>
                      field.onChange([...getValues("proofImages"), url])
                    }
                    onError={(error) => toast.error(error.message)}
                  />
                ) : null}

                <CloudinaryPreview
                  images={field.value}
                  disabled={isFormBusy}
                  onRemove={(index) =>
                    field.onChange(
                      field.value.filter(
                        (_, imageIndex) => imageIndex !== index,
                      ),
                    )
                  }
                />
              </Field>
            )}
          />

          {errors.proofImages ? (
            <View className="flex-row items-center gap-2 rounded-sm bg-system-red/5 px-3 py-2">
              <TriangleAlert size={15} color="#AB091E" />
              <Text className="font-sans-semibold text-base text-system-red">
                Add at least one proof image
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-2 rounded-sm bg-neutral-soft-grey-3 px-3 py-2">
              <Camera size={15} color="#6B7580" />
              <Text className="text-base text-neutral-grey-1">
                Photos help admin verify the concern faster.
              </Text>
            </View>
          )}
        </OperationalCard>
      </View>

      <Button
        disabled={isFormBusy}
        onPress={handleSubmit(submit)}
        className="rounded-md shadow-sm"
      >
        {isSubmitting ? (
          <>
            <LoadingIndicator tone="inverse" />
            <Text className="font-sans-semibold text-base text-white">
              Submitting...
            </Text>
          </>
        ) : (
          <Text className="font-sans-semibold text-base text-white">
            Submit report
          </Text>
        )}
      </Button>
    </View>
  );
}
