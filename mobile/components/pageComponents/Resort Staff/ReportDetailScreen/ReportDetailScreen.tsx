import { reportTypeLabels } from "@/components/pageComponents/Resort Staff/reportDisplay";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import ScreenState from "@/components/ui/screen-state";
import { type StatusChipTone } from "@/components/ui/status-chip";
import { useStaffReportById } from "@/hooks/staffReports.hook";
import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
  StaffReport,
} from "@/types/staffReport.type";
import { format, isToday, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle, ClipboardCheck } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import type { ReactNode } from "react";
import { LinkedBookingCard } from "./LinkedBookingCard";
import { MeaningRow } from "./MeaningRow";
import { ProofImagesCard } from "./ProofImagesCard";
import { ReportHeader } from "./ReportHeader";
import { ReportSummaryCard } from "./ReportSummaryCard";
import OperationalCard from "@/components/ui/operational-card";

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
  return isToday(date)
    ? `Today, ${format(date, "h:mm a")}`
    : format(date, "MMM dd, yyyy h:mm a");
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "MMM dd, yyyy");
};

const referenceLabel = (id: string) => `RPT-${id.slice(-4).toUpperCase()}`;

export default function ReportDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reportId?: string }>();
  const reportId = typeof params.reportId === "string" ? params.reportId : undefined;
  const query = useStaffReportById(reportId);

  if (query.isLoading) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" />
          <Text className="text-base text-neutral-grey-1">Loading report...</Text>
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
      <ReportHeader onBack={() => router.back()} reference={reference} />

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
        <ReportSummaryCard
          report={report}
          formatDateTime={formatDateTime}
          severityAccentClassName={severityAccentClassName}
          statusTone={statusTone}
          severityTone={severityTone}
          typeTone={typeTone}
        />

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
          <ReportRejectionCard rejectionNote={report.rejectionNote} />
        ) : (
          <ReviewOutcomeCard
            status={report.status}
            reviewedAt={report.reviewedAt}
            formatDateTime={formatDateTime}
          />
        )}

        {report.booking ? (
          <LinkedBookingCard
            booking={report.booking}
            formatDate={formatDate}
          />
        ) : (
          <GeneralReportCard />
        )}

        <ProofImagesCard proofImages={report.proofImages} />
      </ScrollView>
    </CustomSafeAreaView>
  );
}

function ReportRejectionCard({ rejectionNote }: Pick<StaffReport, "rejectionNote">) {
  return (
    <CustomReportCard
      leftAccentClassName="bg-system-red"
      className="border-system-red/20 bg-system-red/5"
      title="Rejection note"
      description={rejectionNote?.trim() || "No rejection note was provided."}
    />
  );
}

function ReviewOutcomeCard({
  status,
  reviewedAt,
  formatDateTime,
}: {
  status: ReportStatus;
  reviewedAt?: string | null;
  formatDateTime: (value?: string | null) => string;
}) {
  return (
    <CustomReportCard
      title="Review outcome"
      description={
        status === "Approved"
          ? `This report was approved${reviewedAt ? ` on ${formatDateTime(reviewedAt)}` : ""}.`
          : "This report is waiting for admin review."
      }
    />
  );
}

function GeneralReportCard() {
  return (
    <CustomReportCard
      icon={<ClipboardCheck size={18} color="#0E33F3" />}
      title="General resort report"
      description="This report is not connected to a guest booking."
    />
  );
}

function CustomReportCard({
  title,
  description,
  icon,
  leftAccentClassName,
  className,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  leftAccentClassName?: string;
  className?: string;
}) {
  return (
    <OperationalCard
      className={className}
      leftAccentClassName={leftAccentClassName}
      contentClassName="gap-2 px-5 py-4"
    >
      {icon ? (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="font-sans-bold text-lg text-neutral-dark-1">
            {title}
          </Text>
        </View>
      ) : (
        <Text className="font-sans-bold text-lg text-neutral-dark-1">
          {title}
        </Text>
      )}
      <Text className="text-base leading-5 text-neutral-grey-1">
        {description}
      </Text>
    </OperationalCard>
  );
}
