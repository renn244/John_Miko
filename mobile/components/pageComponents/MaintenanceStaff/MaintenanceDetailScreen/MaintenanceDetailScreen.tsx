import { CloudinaryPreview } from '@/components/common/CloudinaryPreview';
import { CloudinaryUpload } from '@/components/common/CloudinaryUpload';
import { Button } from '@/components/ui/Button';
import CustomSafeAreaView from '@/components/ui/CustomSafeAreaView';
import OperationalCard from '@/components/ui/operational-card';
import ScreenState from '@/components/ui/screen-state';
import StatusChip, { type StatusChipTone } from '@/components/ui/status-chip';
import {
    useAssignedMaintenanceById,
    useCompleteAssignedMaintenance,
    useStartAssignedMaintenance,
} from '@/hooks/maintenance.hook';
import { toast } from '@/lib/toast';
import type { MaintenancePriority, MaintenanceStatus } from '@/types/maintenance.type';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangle, SearchX } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import { ChevronStepper } from './ChevronStepper';
import { DetailHeader } from './DetailHeader';
import { MaintenanceSkeletonCard, MaintenanceSkeletonTimeline } from './MaintenanceDetailSkeleton';
import { ResolutionDetails } from './ResolutionDetails';
import { TimelineCard } from './TimelineCard';

const priorityTone: Record<MaintenancePriority, StatusChipTone> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
};

const statusTone: Record<MaintenanceStatus, StatusChipTone> = {
  Pending: 'pending',
  InProgress: 'inProgress',
  Completed: 'completed',
  Closed: 'neutral',
};

const statusLabel: Record<MaintenanceStatus, string> = {
  Pending: 'Pending',
  InProgress: 'In Progress',
  Completed: 'Completed',
  Closed: 'Closed',
};

const priorityAccentClassName: Record<MaintenancePriority, string> = {
  Low: 'bg-primary',
  Medium: 'bg-secondary-yellow-light',
  High: 'bg-system-red',
};

const statusStepIndex: Record<MaintenanceStatus, number> = {
  Pending: 0,
  InProgress: 1,
  Completed: 2,
  Closed: 3,
};

export default function MaintenanceDetailScreen() {
  const router = useRouter();
  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();
  const maintenanceIdParam = Array.isArray(maintenanceId) ? maintenanceId[0] : maintenanceId;
  const detailQuery = useAssignedMaintenanceById(maintenanceIdParam);
  const startMutation = useStartAssignedMaintenance();
  const completeMutation = useCompleteAssignedMaintenance(maintenanceIdParam ?? "");

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

  if (!maintenanceIdParam) {
    return (
      <NotFoundState router={router} />
    );
  }

  if (detailQuery.isLoading) {
    return (
      <LoadingState router={router} />
    );
  }

  if (detailQuery.error) {
    return (
      <ErrorState 
      router={router}
      refetch={detailQuery.refetch}
      />
    );
  }

  if (!detailQuery.data) {
    return (
      <NotFoundState router={router} />
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
            <Text className="font-sans-bold text-lg text-neutral-dark-1">
              Linked context
            </Text>
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
            <Text className="font-sans-bold text-lg text-neutral-dark-1">
              Issue photos
            </Text>
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
            <Text className="font-sans-bold text-lg text-neutral-dark-1">
              Update progress
            </Text>

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

const NotFoundState = ({
    router
}: {
    router: ReturnType<typeof useRouter>
}) => {
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
    )
}

const ErrorState = ({
    router,
    refetch
} : {
    router: ReturnType<typeof useRouter>
    refetch: () => void
}) => {
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
                    onAction={() => refetch()}
                />
                <Button variant="outline" onPress={() => router.back()} className="mt-2">
                    <Text className="font-sans-semibold text-base text-primary">
                        Go back
                    </Text>
                </Button>
            </View>
        </CustomSafeAreaView>
    )
}

const LoadingState = ({
    router
}: {
    router: ReturnType<typeof useRouter>
}) => {
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
    )
}