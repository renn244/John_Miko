import { reportTypeLabels } from "@/components/pageComponents/Resort Staff/reportDisplay";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import { useStaffReportById } from "@/hooks/staffReports.hook";
import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
} from "@/types/staffReport.type";
import { format, isToday, parseISO } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  ImageIcon,
  Link as LinkIcon,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const statusTone: Record<ReportStatus, StatusChipTone> = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
};

const severityTone: Record<ReportSeverity, StatusChipTone> = {
  Low: "low",
  Medium: "medium",
  High: "high",
};

const typeTone: Record<ReportType, StatusChipTone> = {
  checkIn: "primary",
  checkOut: "info",
  maintenance: "maintenance",
};

const severityAccentClassName: Record<ReportSeverity, string> = {
  Low: "bg-secondary-blue-light",
  Medium: "bg-secondary-yellow-light",
  High: "bg-system-red",
};

const statusMeaning: Record<ReportStatus, string> = {
  Pending: "Waiting for admin review.",
  Approved: "Approved by admin review.",
  Rejected: "Needs changes before it can be accepted.",
};

const typeMeaning: Record<ReportType, string> = {
  checkIn: "Documents arrival or room readiness.",
  checkOut: "Documents departure or post-stay concerns.",
  maintenance: "Documents a facility issue.",
};

const severityMeaning: Record<ReportSeverity, string> = {
  Low: "Minor issue with low operational risk.",
  Medium: "Needs attention, but not urgent.",
  High: "Urgent issue that may affect safety.",
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return value;
  return isToday(date) ? `Today, ${format(date, "h:mm a")}` : format(date, "MMM dd, yyyy h:mm a");
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "MMM dd, yyyy");
};

const referenceLabel = (id: string) => `RPT-${id.slice(-4).toUpperCase()}`;
const bookingReferenceLabel = (id: string) => `#BKG-${id.slice(-4).toUpperCase()}`;

export default function StaffReportDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reportId?: string }>();
  const reportId =
    typeof params.reportId === "string" ? params.reportId : undefined;
  const query = useStaffReportById(reportId);

  if (query.isLoading) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" />
          <Text className="text-base text-neutral-grey-1">
            Loading report...
          </Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (!reportId || query.error || !query.data) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
        <View className="flex-1 items-center justify-center">
          <ScreenState
            tone="danger"
            icon={<AlertTriangle size={24} color="#AB091E" />}
            title="Report not available"
            description="It may not exist or you may not have access to it."
            actionLabel={reportId ? "Retry" : undefined}
            onAction={reportId ? () => query.refetch() : undefined}
          />
          <Button variant="ghost" onPress={() => router.back()} className="mt-2">
            <Text className="font-sans-semibold text-base text-neutral-dark-1">
              Go back
            </Text>
          </Button>
        </View>
      </CustomSafeAreaView>
    );
  }

  const report = query.data;
  const reference = referenceLabel(report.id);

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="flex-row items-center gap-3 border-b border-neutral-soft-grey-2 px-4 pb-3 pt-2">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center"
        >
          <ArrowLeft size={21} color="#0E33F3" />
        </Pressable>
        <View className="flex-1">
          <Text className="font-sans-bold text-lg text-primary">
            Report details
          </Text>
          <Text className="text-sm text-neutral-grey-1">
            Reference: {reference}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
          gap: 12,
        }}
      >
        <OperationalCard
          leftAccentClassName={severityAccentClassName[report.severity]}
          contentClassName="gap-3 px-5 py-4"
        >
          <View className="flex-row flex-wrap gap-2">
            <StatusChip
              label={report.status}
              tone={statusTone[report.status]}
              size="md"
            />
            <StatusChip
              label={reportTypeLabels[report.type]}
              tone={typeTone[report.type]}
              size="md"
            />
            <StatusChip
              label={report.severity}
              tone={severityTone[report.severity]}
              size="md"
            />
          </View>

          <Text className="font-sans-bold text-xl leading-7 text-neutral-dark-1">
            {report.title}
          </Text>

          <View className="flex-row items-center gap-2">
            <CalendarDays size={16} color="#6B7580" />
            <Text className="text-base text-neutral-grey-1">
              {formatDateTime(report.createdAt)}
            </Text>
          </View>

          <Text className="text-lg leading-6 text-neutral-dark-2">
            {report.description}
          </Text>
        </OperationalCard>

        <View className="gap-2 px-1">
          <MeaningRow
            label={report.status}
            tone={statusTone[report.status]}
            text={statusMeaning[report.status]}
          />
          <MeaningRow
            label={reportTypeLabels[report.type]}
            tone={typeTone[report.type]}
            text={typeMeaning[report.type]}
          />
          <MeaningRow
            label={report.severity}
            tone={severityTone[report.severity]}
            text={severityMeaning[report.severity]}
          />
        </View>

        {report.status === "Rejected" ? (
          <OperationalCard
            leftAccentClassName="bg-system-red"
            className="border-system-red/20 bg-system-red/5"
            contentClassName="gap-2 px-5 py-4"
          >
            <Text className="font-sans-bold text-lg text-neutral-dark-1">
              Rejection note
            </Text>
            <Text className="text-base leading-5 text-neutral-dark-2">
              {report.rejectionNote?.trim() || "No rejection note was provided."}
            </Text>
          </OperationalCard>
        ) : (
          <OperationalCard contentClassName="gap-2 px-5 py-4">
            <Text className="font-sans-bold text-lg text-neutral-dark-1">
              Review outcome
            </Text>
            <Text className="text-base leading-5 text-neutral-grey-1">
              {report.status === "Approved"
                ? `This report was approved${report.reviewedAt ? ` on ${formatDateTime(report.reviewedAt)}` : ""}.`
                : "This report is waiting for admin review."}
            </Text>
          </OperationalCard>
        )}

        {report.booking ? (
          <OperationalCard contentClassName="gap-3 px-5 py-4">
            <View className="flex-row items-center gap-2">
              <LinkIcon size={18} color="#0E33F3" />
              <Text className="font-sans-bold text-lg text-neutral-dark-1">
                Linked booking
              </Text>
            </View>
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1">
                <Text className="font-sans-semibold text-base text-neutral-dark-1">
                  {report.booking.guestName}
                </Text>
                <Text className="text-base text-neutral-grey-1">
                  {report.booking.accommodation.name} • {report.booking.accommodation.type}
                </Text>
                <Text className="text-base text-neutral-grey-1">
                  Booking date: {formatDate(report.booking.bookingDate)}
                </Text>
              </View>
              <StatusChip
                label={bookingReferenceLabel(report.booking.id)}
                tone="primary"
                size="sm"
              />
            </View>
          </OperationalCard>
        ) : (
          <OperationalCard contentClassName="gap-2 px-5 py-4">
            <View className="flex-row items-center gap-2">
              <ClipboardCheck size={18} color="#0E33F3" />
              <Text className="font-sans-bold text-lg text-neutral-dark-1">
                General resort report
              </Text>
            </View>
            <Text className="text-base leading-5 text-neutral-grey-1">
              This report is not connected to a guest booking.
            </Text>
          </OperationalCard>
        )}

        <OperationalCard contentClassName="gap-3 px-5 py-4">
          <View className="flex-row items-center gap-2">
            <ImageIcon size={18} color="#0E33F3" />
            <Text className="font-sans-bold text-lg text-neutral-dark-1">
              Proof photos
            </Text>
            <Text className="text-base text-neutral-grey-1">
              ({report.proofImages.length} photos)
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {report.proofImages.map((imageUrl, index) => (
              <View
                key={`${imageUrl}-${index}`}
                className="overflow-hidden rounded-md bg-neutral-soft-grey-2"
                style={{ width: "47%", aspectRatio: 1 }}
              >
                <Image
                  source={imageUrl}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={150}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </View>
        </OperationalCard>
      </ScrollView>
    </CustomSafeAreaView>
  );
}

function MeaningRow({
  label,
  tone,
  text,
}: {
  label: string;
  tone: StatusChipTone;
  text: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <StatusChip label={label} tone={tone} size="sm" />
      <Text className="flex-1 text-base text-neutral-grey-1">
        {text}
      </Text>
    </View>
  );
}
