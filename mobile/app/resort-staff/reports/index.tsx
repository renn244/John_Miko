import {
  reportTypeLabels,
} from "@/components/pageComponents/Resort Staff/reportDisplay";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import { useMyStaffReports } from "@/hooks/staffReports.hook";
import { useStaffReportsFilterStore } from "@/store/staffReportsFilter.store";
import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
  StaffReport,
} from "@/types/staffReport.type";
import { format, isToday, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  Filter,
  Plus,
  RotateCcw,
  X,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";

type ReportSection = {
  title: string;
  dotClassName: string;
  data: StaffReport[];
};

type FilterOption<T extends string> = {
  label: string;
  value?: T;
};

const statusOptions: FilterOption<ReportStatus>[] = [
  { label: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const typeOptions: FilterOption<ReportType>[] = [
  { label: "All" },
  { label: "Check-in", value: "checkIn" },
  { label: "Check-out", value: "checkOut" },
  { label: "Maintenance", value: "maintenance" },
];

const severityOptions: FilterOption<ReportSeverity>[] = [
  { label: "All" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

const statusMeta: Record<
  ReportStatus,
  {
    sectionTitle: string;
    accentClassName: string;
    dotClassName: string;
    tone: StatusChipTone;
  }
> = {
  Pending: {
    sectionTitle: "Pending action",
    accentClassName: "bg-secondary-yellow-light",
    dotClassName: "bg-secondary-yellow-light",
    tone: "pending",
  },
  Approved: {
    sectionTitle: "Approved",
    accentClassName: "bg-secondary-green-light",
    dotClassName: "bg-secondary-green-light",
    tone: "approved",
  },
  Rejected: {
    sectionTitle: "Rejected",
    accentClassName: "bg-system-red",
    dotClassName: "bg-system-red",
    tone: "rejected",
  },
};

const severityTone: Record<ReportSeverity, StatusChipTone> = {
  Low: "low",
  Medium: "medium",
  High: "high",
};

const reportStatusOrder: ReportStatus[] = ["Pending", "Rejected", "Approved"];

const formatCreatedAt = (value: string) => {
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return value;
  return isToday(date) ? `Today, ${format(date, "h:mm a")}` : format(date, "MMM dd, yyyy");
};

export default function MyStaffReportsScreen() {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const status = useStaffReportsFilterStore((state) => state.status);
  const type = useStaffReportsFilterStore((state) => state.type);
  const severity = useStaffReportsFilterStore((state) => state.severity);
  const setStatus = useStaffReportsFilterStore((state) => state.setStatus);
  const setType = useStaffReportsFilterStore((state) => state.setType);
  const setSeverity = useStaffReportsFilterStore((state) => state.setSeverity);
  const reset = useStaffReportsFilterStore((state) => state.reset);

  const query = useMyStaffReports({ status, type, severity });
  const reports = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );
  const activeFilterCount = [status, type, severity].filter(Boolean).length;

  const sections = useMemo<ReportSection[]>(() => {
    return reportStatusOrder
      .map((reportStatus) => {
        const items = reports.filter((report) => report.status === reportStatus);
        return {
          title: statusMeta[reportStatus].sectionTitle,
          dotClassName: statusMeta[reportStatus].dotClassName,
          data: items,
        };
      })
      .filter((section) => section.data.length > 0);
  }, [reports]);

  const onRefresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const renderReport = useCallback(
    ({ item }: { item: StaffReport }) => (
      <ReportCard
        report={item}
        onPress={() =>
          router.push({
            pathname: "/resort-staff/reports/[reportId]",
            params: { reportId: item.id },
          })
        }
      />
    ),
    [router],
  );

  const hasFilters = activeFilterCount > 0;

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="gap-4 border-b border-neutral-soft-grey-2 bg-neutral-soft-grey-3 px-5 pb-4 pt-4">
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1">
            <Text className="font-sans-bold text-2xl text-neutral-dark-1">
              My reports
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              Track reports submitted for admin review.
            </Text>
          </View>
          <Button
            size="icon"
            className="h-11 w-11 rounded-md"
            onPress={() => router.push("/resort-staff/new-report")}
          >
            <Plus size={21} color="#FFFFFF" />
          </Button>
        </View>

        <View className="flex-row flex-wrap items-center gap-2">
          <Pressable
            onPress={() => setFilterOpen(true)}
            className="h-10 flex-row items-center gap-2 rounded-full border border-neutral-soft-grey-1 bg-white px-4"
          >
            <Filter size={16} color="#1F2933" />
            <Text className="font-sans-semibold text-base text-neutral-dark-1">
              Filter
            </Text>
            {activeFilterCount ? (
              <View className="h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5">
                <Text className="font-sans-semibold text-sm text-white">
                  {activeFilterCount}
                </Text>
              </View>
            ) : null}
          </Pressable>

          {status ? (
            <ActiveFilterChip
              label={status}
              tone={statusMeta[status].tone}
              onClear={() => setStatus(undefined)}
            />
          ) : null}
          {type ? (
            <ActiveFilterChip
              label={reportTypeLabels[type]}
              tone="neutral"
              onClear={() => setType(undefined)}
            />
          ) : null}
          {severity ? (
            <ActiveFilterChip
              label={`${severity} severity`}
              tone={severityTone[severity]}
              onClear={() => setSeverity(undefined)}
            />
          ) : null}
        </View>
      </View>

      {query.isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" />
          <Text className="text-base text-neutral-grey-1">
            Loading reports...
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderReport}
          renderSectionHeader={({ section }) => (
            <View className="flex-row items-center gap-2 bg-neutral-soft-grey-3 pb-2 pt-4">
              <View className={`h-2.5 w-2.5 rounded-full ${section.dotClassName}`} />
              <Text className="font-sans-bold text-lg text-neutral-dark-1">
                {section.title}
              </Text>
            </View>
          )}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 28,
            paddingTop: 4,
            flexGrow: reports.length === 0 ? 1 : undefined,
          }}
          refreshControl={
            <RefreshControl
              refreshing={query.isRefetching && !query.isFetchingNextPage}
              onRefresh={onRefresh}
            />
          }
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
              query.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.35}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <ActivityIndicator className="py-5" />
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-2">
              <ScreenState
                tone={query.error ? "danger" : "info"}
                icon={
                  query.error ? (
                    <AlertTriangle size={24} color="#AB091E" />
                  ) : (
                    <ClipboardList size={24} color="#0E33F3" />
                  )
                }
                title={query.error ? "Could not load reports" : "No reports found"}
                description={
                  query.error
                    ? "Check your connection and try again."
                    : hasFilters
                      ? "Try changing the selected filters to find what you need."
                      : "Submit a report when something needs admin review."
                }
                actionLabel={query.error ? "Retry" : hasFilters ? "Reset filters" : "Create report"}
                onAction={() => {
                  if (query.error) query.refetch();
                  else if (hasFilters) reset();
                  else router.push("/resort-staff/new-report");
                }}
              />
            </View>
          }
        />
      )}

      <FilterSheet
        visible={filterOpen}
        status={status}
        type={type}
        severity={severity}
        setStatus={setStatus}
        setType={setType}
        setSeverity={setSeverity}
        onReset={reset}
        onClose={() => setFilterOpen(false)}
      />
    </CustomSafeAreaView>
  );
}

function ReportCard({
  report,
  onPress,
}: {
  report: StaffReport;
  onPress: () => void;
}) {
  const meta = statusMeta[report.status];

  return (
    <OperationalCard
      onPress={onPress}
      leftAccentClassName={meta.accentClassName}
      contentClassName="gap-3 px-4 py-4"
      className="mb-3 rounded-md"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-sm uppercase tracking-wide text-neutral-grey-1">
            RPT-{report.id.slice(-4).toUpperCase()} • {reportTypeLabels[report.type]}
          </Text>
          <Text
            numberOfLines={2}
            className="mt-1 font-sans-bold text-lg leading-6 text-neutral-dark-1"
          >
            {report.title}
          </Text>
        </View>
        <StatusChip
          label={report.status}
          tone={meta.tone}
          size="sm"
          uppercase
        />
      </View>

      <Text numberOfLines={2} className="text-base leading-5 text-neutral-dark-2">
        {report.description}
      </Text>

      <View className="h-px bg-neutral-soft-grey-2" />

      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-1.5">
          <CalendarDays size={15} color="#4D5963" />
          <Text className="font-sans-semibold text-base text-neutral-dark-2">
            {formatCreatedAt(report.createdAt)}
          </Text>
        </View>
        <StatusChip
          label={`${report.severity} severity`}
          tone={severityTone[report.severity]}
          size="sm"
        />
      </View>
    </OperationalCard>
  );
}

function ActiveFilterChip({
  label,
  tone,
  onClear,
}: {
  label: string;
  tone: StatusChipTone;
  onClear: () => void;
}) {
  return (
    <Pressable
      onPress={onClear}
      className="flex-row items-center gap-1 rounded-full"
    >
      <StatusChip
        label={label}
        tone={tone}
        size="md"
        icon={<X size={13} color="#4D5963" />}
      />
    </Pressable>
  );
}

function FilterSheet({
  visible,
  status,
  type,
  severity,
  setStatus,
  setType,
  setSeverity,
  onReset,
  onClose,
}: {
  visible: boolean;
  status?: ReportStatus;
  type?: ReportType;
  severity?: ReportSeverity;
  setStatus: (status?: ReportStatus) => void;
  setType: (type?: ReportType) => void;
  setSeverity: (severity?: ReportSeverity) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/35">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="gap-5 rounded-t-3xl border border-neutral-soft-grey-2 bg-white px-5 pb-7 pt-5">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-xl text-neutral-dark-1">
              Filter reports
            </Text>
            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-neutral-soft-grey-3"
            >
              <X size={19} color="#1F2933" />
            </Pressable>
          </View>

          <FilterGroup
            title="Status"
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
          <FilterGroup
            title="Type"
            options={typeOptions}
            value={type}
            onChange={setType}
          />
          <FilterGroup
            title="Severity"
            options={severityOptions}
            value={severity}
            onChange={setSeverity}
          />

          <View className="flex-row gap-3 border-t border-neutral-soft-grey-2 pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onPress={onReset}
            >
              <RotateCcw size={16} color="#1F2933" />
              <Text className="font-sans-semibold text-base text-neutral-dark-1">
                Reset
              </Text>
            </Button>
            <Button size="sm" className="flex-1" onPress={onClose}>
              <Text className="font-sans-semibold text-base text-white">
                Apply filters
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FilterGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: FilterOption<T>[];
  value?: T;
  onChange: (value?: T) => void;
}) {
  return (
    <View className="gap-3">
      <Text className="font-sans-semibold text-base text-neutral-dark-1">
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value || (!value && !option.value);
          return (
            <Pressable
              key={option.value ?? "all"}
              onPress={() => onChange(option.value)}
              className={`h-10 items-center justify-center rounded-full border px-4 ${
                selected
                  ? "border-primary bg-primary"
                  : "border-neutral-soft-grey-2 bg-white"
              }`}
            >
              <Text
                className={`font-sans-semibold text-base ${
                  selected ? "text-white" : "text-neutral-dark-2"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
