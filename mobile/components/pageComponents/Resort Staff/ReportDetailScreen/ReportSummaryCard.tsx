import OperationalCard from "@/components/ui/operational-card";
import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
  StaffReport,
} from "@/types/staffReport.type";
import { CalendarDays } from "lucide-react-native";
import { Text, View } from "react-native";
import { reportTypeLabels } from "../reportDisplay";

type ReportSummaryCardProps = {
  report: StaffReport;
  formatDateTime: (value?: string | null) => string;
  severityAccentClassName: Record<ReportSeverity, string>;
  statusTone: Record<ReportStatus, StatusChipTone>;
  severityTone: Record<ReportSeverity, StatusChipTone>;
  typeTone: Record<ReportType, StatusChipTone>;
};

export function ReportSummaryCard({
  report,
  formatDateTime,
  severityAccentClassName,
  statusTone,
  severityTone,
  typeTone,
}: ReportSummaryCardProps) {
  return (
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
  );
}
