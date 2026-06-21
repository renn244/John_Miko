import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import {
  useAssignedMaintenanceById,
  useCompleteAssignedMaintenance,
  useStartAssignedMaintenance,
} from "@/hooks/maintenance.hook";
import { toast } from "@/lib/toast";
import type {
  AssignedMaintenanceDetail,
  MaintenancePriority,
  MaintenanceStatus,
} from "@/types/maintenance.type";
import { format } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  ImageOff,
  SearchX,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type StepKey = "Pending" | "Started" | "Done" | "Closed";

const priorityTone: Record<MaintenancePriority, StatusChipTone> = {
  Low: "low",
  Medium: "medium",
  High: "high",
};

const statusTone: Record<MaintenanceStatus, StatusChipTone> = {
  Pending: "pending",
  InProgress: "inProgress",
  Completed: "completed",
  Closed: "neutral",
};

const statusLabel: Record<MaintenanceStatus, string> = {
  Pending: "Pending",
  InProgress: "In Progress",
  Completed: "Completed",
  Closed: "Closed",
};

const priorityAccentClassName: Record<MaintenancePriority, string> = {
  Low: "bg-primary",
  Medium: "bg-secondary-yellow-light",
  High: "bg-system-red",
};

const statusStepIndex: Record<MaintenanceStatus, number> = {
  Pending: 0,
  InProgress: 1,
  Completed: 2,
  Closed: 3,
};

const steps: StepKey[] = ["Pending", "Started", "Done", "Closed"];
const stepperColors = {
  active: "#0E33F3",
  complete: "#DDFBEF",
  idle: "#EEF2F6",
  divider: "#FFFFFF",
} as const;

const formatDateTime = (value?: string | null) => {
  if (!value) return "Not set yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set yet";
  return format(date, "MMM dd, h:mm a");
};

const getTimelineRows = (maintenance: AssignedMaintenanceDetail) => [
  {
    label: "Ticket Created",
    value: formatDateTime(maintenance.createdAt),
    state: "done" as const,
  },
  {
    label: "Work Started",
    value: maintenance.startedAt ? formatDateTime(maintenance.startedAt) : "Not started yet",
    state: maintenance.startedAt ? ("done" as const) : ("muted" as const),
  },
  {
    label: "Resolved",
    value: maintenance.resolvedAt ? formatDateTime(maintenance.resolvedAt) : "Not resolved yet",
    state: maintenance.resolvedAt ? ("active" as const) : ("muted" as const),
  },
  {
    label: "Closed",
    value: maintenance.closedAt ? formatDateTime(maintenance.closedAt) : "Not closed yet",
    state: maintenance.closedAt ? ("done" as const) : ("muted" as const),
  },
];

export default function MaintenanceStaffDetailScreen() {
  const router = useRouter();
  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();
  const detailQuery = useAssignedMaintenanceById(maintenanceId);
  const startMutation = useStartAssignedMaintenance();
  const completeMutation = useCompleteAssignedMaintenance(maintenanceId);

  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionProofImages, setResolutionProofImages] = useState<string[]>([]);

  const handleComplete = async () => {
    if (resolutionNotes.trim().length < 20) {
      toast.error("Resolution notes must be at least 20 characters.");
      return;
    }

    if (resolutionProofImages.length === 0) {
      toast.error("Add at least one proof image.");
      return;
    }

    await completeMutation.mutateAsync({
      resolutionNotes: resolutionNotes.trim(),
      resolutionProofImages,
    });
  };

  if (detailQuery.isLoading) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <DetailHeader onBack={() => router.back()} title="Ticket Details" />
        <View className="gap-4 px-5 pt-4">
          <MaintenanceSkeletonCard />
          <MaintenanceSkeletonTimeline />
          <Text className="text-center text-base text-neutral-grey-1">
            Loading ticket details...
          </Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (detailQuery.error) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <DetailHeader onBack={() => router.back()} title="Ticket Details" />
        <View className="flex-1 justify-center px-6">
          <ScreenState
            icon={<AlertTriangle size={24} color="#AB091E" />}
            tone="danger"
            title="Could not load ticket"
            description="Check your connection and try again."
            actionLabel="Retry"
            onAction={() => detailQuery.refetch()}
          />
          <Button variant="outline" onPress={() => router.back()} className="mt-2">
            <Text className="font-sans-semibold text-base text-primary">
              Go back
            </Text>
          </Button>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (!detailQuery.data) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <DetailHeader onBack={() => router.back()} title="Ticket Details" />
        <View className="flex-1 justify-center px-6">
          <ScreenState
            icon={<SearchX size={24} color="#6B7280" />}
            tone="neutral"
            title="Maintenance ticket not found"
            description="This ticket may no longer be assigned to you."
            actionLabel="Go back"
            onAction={() => router.back()}
          />
        </View>
      </CustomSafeAreaView>
    );
  }

  const maintenance = detailQuery.data;
  const currentStepIndex = statusStepIndex[maintenance.status];

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <DetailHeader
        onBack={() => router.back()}
        title="Ticket Details"
        badge={`ID: ${maintenance.id}`}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
          gap: 14,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ChevronStepper currentStepIndex={currentStepIndex} />

        <OperationalCard
          leftAccentClassName={priorityAccentClassName[maintenance.priority]}
          contentClassName="gap-4 px-4 py-4"
        >
          <View className="gap-3">
            <Text className="font-sans-bold text-xl text-neutral-dark-1">
              {maintenance.title}
            </Text>

            <View className="flex-row flex-wrap gap-2">
              <StatusChip
                label={`${maintenance.priority} Priority`}
                tone={priorityTone[maintenance.priority]}
                size="sm"
                uppercase
              />
              <StatusChip
                label={statusLabel[maintenance.status]}
                tone={statusTone[maintenance.status]}
                size="sm"
                uppercase
              />
              <StatusChip
                label={maintenance.expertise}
                tone="info"
                size="sm"
                uppercase
              />
            </View>
          </View>

          <View className="h-px bg-neutral-soft-grey-2" />

          <View className="gap-2">
            <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
              Description
            </Text>
            <Text className="text-base leading-6 text-neutral-dark-1">
              {maintenance.description}
            </Text>
          </View>
        </OperationalCard>

        <TimelineCard maintenance={maintenance} />

        {maintenance.report?.booking ? (
          <OperationalCard contentClassName="gap-3 px-4 py-4">
            <SectionTitle title="Linked context" />
            <View className="gap-2">
              <DetailRow label="Guest" value={maintenance.report.booking.guestName} />
              <DetailRow
                label="Location"
                value={maintenance.report.booking.accommodation.name}
              />
              <DetailRow label="Booking ID" value={maintenance.report.booking.id} />
            </View>
          </OperationalCard>
        ) : null}

        {maintenance.imagesUrl?.length ? (
          <OperationalCard contentClassName="gap-3 px-4 py-4">
            <SectionTitle title="Issue photos" />
            <View className="flex-row gap-2">
              {maintenance.imagesUrl.slice(0, 3).map((imageUrl, index) => (
                <Image
                  key={`${imageUrl}-${index}`}
                  source={imageUrl}
                  contentFit="cover"
                  style={{ flex: 1, height: 96, borderRadius: 6 }}
                />
              ))}
            </View>
          </OperationalCard>
        ) : null}

        {maintenance.resolutionNotes ? (
          <ResolutionDetails maintenance={maintenance} />
        ) : null}

        {maintenance.status === "Pending" ? (
          <Button
            disabled={startMutation.isPending}
            onPress={() => startMutation.mutate(maintenance.id)}
          >
            {startMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-sans-semibold text-lg text-white">
                Start maintenance
              </Text>
            )}
          </Button>
        ) : null}

        {maintenance.status === "InProgress" ? (
          <OperationalCard contentClassName="gap-4 px-4 py-4">
            <SectionTitle title="Update progress" />

            <View className="gap-2">
              <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
                Resolution notes
              </Text>
              <TextInput
                value={resolutionNotes}
                onChangeText={setResolutionNotes}
                placeholder="Describe actions taken..."
                placeholderTextColor="#9FA8B1"
                multiline
                textAlignVertical="top"
                maxLength={400}
                className="min-h-32 rounded-xl border border-neutral-soft-grey-1 bg-white px-4 py-3 text-base text-neutral-dark-1"
              />
              <Text className="text-right text-sm text-neutral-grey-1">
                {resolutionNotes.length}/400
              </Text>
            </View>

            <View className="gap-3">
              <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
                Proof photos
              </Text>
              {resolutionProofImages.length < 3 ? (
                <CloudinaryUpload
                  onSuccess={(url) =>
                    setResolutionProofImages((prev) => [...prev, url])
                  }
                  onError={(error) => toast.error(error.message)}
                  disabled={completeMutation.isPending}
                />
              ) : null}

              <CloudinaryPreview
                images={resolutionProofImages}
                onRemove={(index) =>
                  setResolutionProofImages((prev) =>
                    prev.filter((_, currentIndex) => currentIndex !== index),
                  )
                }
                disabled={completeMutation.isPending}
              />
            </View>

            <Button disabled={completeMutation.isPending} onPress={handleComplete}>
              {completeMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-sans-semibold text-lg text-white">
                  Mark as completed
                </Text>
              )}
            </Button>
          </OperationalCard>
        ) : null}
      </ScrollView>
    </CustomSafeAreaView>
  );
}

function DetailHeader({
  onBack,
  title,
  badge,
}: {
  onBack: () => void;
  title: string;
  badge?: string;
}) {
  return (
    <View className="flex-row items-center gap-3 border-b border-neutral-soft-grey-2 bg-neutral-soft-grey-3 px-5 py-4">
      <Pressable onPress={onBack} className="h-9 w-9 items-center justify-center">
        <ArrowLeft size={26} color="#0E33F3" />
      </Pressable>
      <Text className="flex-1 font-sans-bold text-xl text-neutral-dark-1">
        {title}
      </Text>
      {badge ? (
        <View className="max-w-36 rounded-md bg-secondary-blue-light px-3 py-2">
          <Text className="font-sans-bold text-base text-neutral-dark-2" numberOfLines={1}>
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function ChevronStepper({ currentStepIndex }: { currentStepIndex: number }) {
  return (
    <View className="flex-row rounded-md border border-neutral-soft-grey-2 bg-white px-1 py-1">
      {steps.map((step, index) => {
        const isComplete = index < currentStepIndex;
        const isActive = index === currentStepIndex;
        const backgroundColor = isActive
          ? stepperColors.active
          : isComplete
            ? stepperColors.complete
            : stepperColors.idle;

        return (
          <View
            key={step}
            className="relative flex-1 items-center justify-center py-2.5"
            style={{
              backgroundColor,
              marginLeft: index === 0 ? 0 : 4,
              paddingLeft: index === 0 ? 6 : 15,
              paddingRight: index === steps.length - 1 ? 6 : 16,
              zIndex: steps.length - index,
            }}
          >
            {index > 0 ? (
              <View
                pointerEvents="none"
                style={[
                  styles.stepperNotch,
                  { borderLeftColor: stepperColors.divider },
                ]}
              />
            ) : null}
            {index < steps.length - 1 ? (
              <>
                <View
                  pointerEvents="none"
                  style={[
                    styles.stepperSeamCover,
                    { backgroundColor },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.stepperArrow,
                    { borderLeftColor: backgroundColor },
                  ]}
                />
              </>
            ) : null}
            <Text
              className={`font-sans-bold text-xs ${
                isActive
                  ? "text-white"
                  : isComplete
                    ? "text-secondary-green-dark"
                    : "text-neutral-grey-1"
              }`}
              numberOfLines={1}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function TimelineCard({ maintenance }: { maintenance: AssignedMaintenanceDetail }) {
  const rows = getTimelineRows(maintenance);

  return (
    <OperationalCard contentClassName="gap-4 px-4 py-4">
      <SectionTitle title="Timeline" />
      <View>
        {rows.map((row, index) => (
          <View key={row.label} className="flex-row gap-3">
            <View className="items-center">
              <View
                className={`mt-1 h-2.5 w-2.5 rounded-full ${
                  row.state === "active"
                    ? "bg-primary"
                    : row.state === "done"
                      ? "bg-secondary-green-dark"
                      : "bg-neutral-soft-grey-1"
                }`}
              />
              {index < rows.length - 1 ? (
                <View className="h-8 w-px bg-neutral-soft-grey-1" />
              ) : null}
            </View>
            <Text
              className={`flex-1 font-sans-semibold text-sm ${
                row.state === "muted" ? "text-neutral-grey-1" : "text-neutral-dark-1"
              }`}
            >
              {row.label}
            </Text>
            <Text
              className={`text-right font-sans-semibold text-base ${
                row.state === "muted" ? "text-neutral-grey-1" : "text-neutral-dark-2"
              }`}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </OperationalCard>
  );
}

function ResolutionDetails({ maintenance }: { maintenance: AssignedMaintenanceDetail }) {
  return (
    <OperationalCard contentClassName="gap-3 px-4 py-4">
      <SectionTitle title="Resolution details" />
      <Text className="text-base leading-6 text-neutral-dark-1">
        {maintenance.resolutionNotes}
      </Text>

      {maintenance.resolutionProofImages?.length ? (
        <View className="flex-row gap-2">
          {maintenance.resolutionProofImages.slice(0, 3).map((imageUrl, index) => (
            <Image
              key={`${imageUrl}-${index}`}
              source={imageUrl}
              contentFit="cover"
              style={{ flex: 1, height: 90, borderRadius: 6 }}
            />
          ))}
        </View>
      ) : (
        <View className="flex-row items-center gap-2 rounded-md bg-neutral-soft-grey-3 px-3 py-3">
          <ImageOff size={18} color="#6B7280" />
          <Text className="text-base text-neutral-grey-1">
            No proof photos attached.
          </Text>
        </View>
      )}
    </OperationalCard>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="font-sans-bold text-lg text-neutral-dark-1">
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  stepperArrow: {
    borderBottomColor: "transparent",
    borderBottomWidth: 18,
    borderLeftWidth: 18,
    borderTopColor: "transparent",
    borderTopWidth: 18,
    height: 0,
    position: "absolute",
    right: -18,
    top: 0,
    width: 0,
    zIndex: 4,
  },
  stepperSeamCover: {
    bottom: 0,
    position: "absolute",
    right: -1,
    top: 0,
    width: 3,
    zIndex: 3,
  },
  stepperNotch: {
    borderBottomColor: "transparent",
    borderBottomWidth: 18,
    borderLeftWidth: 16,
    borderTopColor: "transparent",
    borderTopWidth: 18,
    height: 0,
    left: 0,
    position: "absolute",
    top: 0,
    width: 0,
    zIndex: 3,
  },
});

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="rounded-md bg-neutral-soft-grey-3 px-3 py-2">
      <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
        {label}
      </Text>
      <Text className="mt-1 font-sans-semibold text-base text-neutral-dark-1">
        {value}
      </Text>
    </View>
  );
}

function MaintenanceSkeletonCard() {
  return (
    <OperationalCard leftAccentClassName="bg-secondary-blue-light" contentClassName="gap-4 px-4 py-4">
      <View className="h-6 w-48 rounded-md bg-neutral-soft-grey-2" />
      <View className="flex-row gap-2">
        <View className="h-8 w-24 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-8 w-24 rounded-md bg-neutral-soft-grey-2" />
      </View>
      <View className="h-px bg-neutral-soft-grey-2" />
      <View className="gap-2">
        <View className="h-4 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-4 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-4 w-3/4 rounded-md bg-neutral-soft-grey-2" />
      </View>
    </OperationalCard>
  );
}

function MaintenanceSkeletonTimeline() {
  return (
    <OperationalCard contentClassName="gap-4 px-4 py-4">
      <View className="h-6 w-24 rounded-md bg-neutral-soft-grey-2" />
      {[1, 2, 3].map((item) => (
        <View key={item} className="flex-row items-center gap-3">
          <View className="h-6 w-6 rounded-full bg-neutral-soft-grey-2" />
          <View className="gap-2">
            <View className="h-4 w-32 rounded-md bg-neutral-soft-grey-2" />
            <View className="h-4 w-44 rounded-md bg-neutral-soft-grey-2" />
          </View>
        </View>
      ))}
    </OperationalCard>
  );
}
