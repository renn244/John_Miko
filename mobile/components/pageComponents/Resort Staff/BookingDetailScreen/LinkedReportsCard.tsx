import { Button } from "@/components/ui/Button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import OperationalCard from "@/components/ui/operational-card";
import SectionTitle from "@/components/ui/section-title";
import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import type { StaffReport, ReportType, ReportStatus } from "@/types/staffReport.type";
import { ClipboardList } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type LinkedReportsCardProps = {
  reports: StaffReport[];
  isLoading: boolean;
  hasError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
  onOpenReport: (reportId: string) => void;
  reportTypeLabels: Record<ReportType, string>;
  reportStatusTone: Record<ReportStatus, StatusChipTone>;
};

export function LinkedReportsCard({
  reports,
  isLoading,
  hasError,
  hasNextPage,
  isFetchingNextPage,
  onRetry,
  onLoadMore,
  onOpenReport,
  reportTypeLabels,
  reportStatusTone,
}: LinkedReportsCardProps) {
  return (
    <OperationalCard contentClassName="gap-3 px-3 py-3">
      <SectionTitle title="My linked reports" />

      {isLoading ? (
        <LoadingIndicator className="py-3" />
      ) : hasError ? (
        <View className="gap-3">
          <Text className="text-base text-neutral-grey-1">
            Could not load reports linked to this booking.
          </Text>
          <Button variant="outline" onPress={onRetry}>
            <Text className="font-sans-semibold text-base text-primary">
              Retry reports
            </Text>
          </Button>
        </View>
      ) : reports.length ? (
        <View className="gap-2">
          {reports.map((report) => (
            <Pressable
              key={report.id}
              onPress={() => onOpenReport(report.id)}
              className="rounded-sm border border-neutral-soft-grey-2 bg-neutral-soft-grey-3 px-3 py-2"
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="font-sans-semibold text-base text-neutral-dark-1">
                    {report.title}
                  </Text>
                  <Text className="mt-1 text-sm text-neutral-grey-1">
                    {reportTypeLabels[report.type]}
                  </Text>
                </View>
                <StatusChip
                  label={report.status}
                  tone={reportStatusTone[report.status]}
                  size="sm"
                />
              </View>
            </Pressable>
          ))}
          {hasNextPage ? (
            <Button
              variant="ghost"
              disabled={isFetchingNextPage}
              onPress={onLoadMore}
            >
              {isFetchingNextPage ? (
                <LoadingIndicator />
              ) : (
                <Text className="font-sans-semibold text-base text-primary">
                  Load more reports
                </Text>
              )}
            </Button>
          ) : null}
        </View>
      ) : (
        <View className="items-center gap-2 rounded-sm border border-dashed border-neutral-soft-grey-1 px-4 py-5">
          <ClipboardList size={22} color="#9FA8B1" />
          <Text className="text-center text-base text-neutral-grey-1">
            You have not submitted a report for this booking.
          </Text>
        </View>
      )}
    </OperationalCard>
  );
}
