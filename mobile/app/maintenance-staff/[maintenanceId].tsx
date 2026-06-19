import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useAssignedMaintenanceById, useCompleteAssignedMaintenance, useStartAssignedMaintenance } from "@/hooks/maintenance.hook";
import { toast } from "@/lib/toast";
import { format } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "MMM dd, yyyy h:mm a");
};

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
      <CustomSafeAreaView className="flex-1 items-center justify-center bg-neutral-soft-grey-3">
        <ActivityIndicator size="large" />
      </CustomSafeAreaView>
    );
  }

  if (!detailQuery.data) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="font-sans-semibold text-2xl text-neutral-dark-1">
            Maintenance ticket not found
          </Text>
          <Text className="mt-2 text-center text-base text-neutral-grey-1">
            This ticket may no longer be assigned to you.
          </Text>
          <View className="mt-5 w-full">
            <Button variant="outline" onPress={() => router.back()}>
              <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                Go Back
              </Text>
            </Button>
          </View>
        </View>
      </CustomSafeAreaView>
    );
  }

  const maintenance = detailQuery.data;

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft size={20} color="#1F2933" />
            </Pressable>

            <View className="flex-1">
              <Text className="font-sans-bold text-2xl text-neutral-dark-1">
                Ticket Details
              </Text>
              <Text className="mt-1 text-base text-neutral-grey-1">
                {maintenance.id}
              </Text>
            </View>
          </View>

          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <Text className="font-sans-semibold text-2xl text-neutral-dark-1">
              {maintenance.title}
            </Text>
            <Text className="mt-2 text-base text-neutral-grey-1">
              {maintenance.expertise} •{" "}
              {maintenance.status === "InProgress" ? "In Progress" : maintenance.status}
            </Text>
            <Text className="mt-4 text-base leading-7 text-neutral-dark-1">
              {maintenance.description}
            </Text>
          </View>

          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <Text className="font-sans-semibold text-xl text-neutral-dark-1">
              Ticket Information
            </Text>
            <View className="mt-4 gap-3">
              <InfoRow label="Priority" value={maintenance.priority} />
              <InfoRow label="Created" value={formatDateTime(maintenance.createdAt)} />
              <InfoRow label="Started" value={formatDateTime(maintenance.startedAt)} />
              <InfoRow label="Resolved" value={formatDateTime(maintenance.resolvedAt)} />
              <InfoRow
                label="Assigned To"
                value={maintenance.assignedTo?.name || maintenance.assignedTo?.email || "You"}
              />
            </View>
          </View>

          {maintenance.report?.booking ? (
            <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
              <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                Linked Booking
              </Text>
              <Text className="mt-4 text-base text-neutral-grey-1">
                {maintenance.report.booking.id}
              </Text>
              <Text className="mt-1 font-sans-semibold text-lg text-neutral-dark-1">
                {maintenance.report.booking.guestName}
              </Text>
              <Text className="mt-2 text-base text-neutral-grey-1">
                {maintenance.report.booking.accommodation.name}
              </Text>
            </View>
          ) : null}

          {maintenance.imagesUrl?.length ? (
            <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
              <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                Issue Photos
              </Text>
              <View className="mt-4 gap-3">
                {maintenance.imagesUrl.map((imageUrl, index) => (
                  <Image
                    key={`${imageUrl}-${index}`}
                    source={imageUrl}
                    contentFit="cover"
                    style={{ width: "100%", height: 220, borderRadius: 20 }}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {maintenance.resolutionNotes ? (
            <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
              <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                Resolution Notes
              </Text>
              <Text className="mt-4 text-base leading-7 text-neutral-dark-1">
                {maintenance.resolutionNotes}
              </Text>

              {maintenance.resolutionProofImages?.length ? (
                <View className="mt-4 gap-3">
                  {maintenance.resolutionProofImages.map((imageUrl, index) => (
                    <Image
                      key={`${imageUrl}-${index}`}
                      source={imageUrl}
                      contentFit="cover"
                      style={{ width: "100%", height: 220, borderRadius: 20 }}
                    />
                  ))}
                </View>
              ) : null}
            </View>
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
                  Start Maintenance
                </Text>
              )}
            </Button>
          ) : null}

          {maintenance.status === "InProgress" ? (
            <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
              <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                Complete Maintenance
              </Text>
              <Text className="mt-1 text-base text-neutral-grey-1">
                Add your resolution notes and proof photos before completion.
              </Text>

              <TextInput
                value={resolutionNotes}
                onChangeText={setResolutionNotes}
                placeholder="Describe what was fixed and how the issue was resolved."
                placeholderTextColor="#9FA8B1"
                multiline
                textAlignVertical="top"
                maxLength={400}
                className="mt-4 min-h-32 rounded-xl border border-neutral-soft-grey-1 bg-neutral-soft-grey-3 px-4 py-3 text-lg text-neutral-dark-1"
              />

              <Text className="mt-2 text-right text-sm text-neutral-grey-1">
                {resolutionNotes.length}/400
              </Text>

              <View className="mt-4 gap-3">
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

              <View className="mt-5">
                <Button
                  disabled={completeMutation.isPending}
                  onPress={handleComplete}
                >
                  {completeMutation.isPending ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="font-sans-semibold text-lg text-white">
                      Mark as Completed
                    </Text>
                  )}
                </Button>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <Text className="text-base text-neutral-grey-1">{label}</Text>
      <Text className="flex-1 text-right font-sans-semibold text-base text-neutral-dark-1">
        {value}
      </Text>
    </View>
  );
};
