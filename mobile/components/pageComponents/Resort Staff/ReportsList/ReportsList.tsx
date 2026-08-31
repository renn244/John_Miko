import {
    reportTypeLabels,
    severityTone,
} from "@/components/pageComponents/Resort Staff/reportDisplay";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip from "@/components/ui/status-chip";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useMyStaffReports } from "@/hooks/staffReports.hook";
import { useStaffReportsFilterStore } from "@/store/staffReportsFilter.store";
import type {
    ReportStatus,
    StaffReport
} from "@/types/staffReport.type";
import { format, isToday, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import {
    AlertTriangle,
    CalendarDays,
    ClipboardList
} from "lucide-react-native";
import { useCallback, useMemo } from "react";
import {
    RefreshControl,
    SectionList,
    Text,
    View
} from "react-native";
import statusMeta from "./StatusMeta.constant";

type ReportSection = {
    title: string;
    dotClassName: string;
    data: StaffReport[];
};

const formatCreatedAt = (value: string) => {
    const date = parseISO(value);
    if (Number.isNaN(date.getTime())) return value;
    return isToday(date) ? `Today, ${format(date, "h:mm a")}` : format(date, "MMM dd, yyyy");
};

const reportStatusOrder: ReportStatus[] = ["Pending", "Rejected", "Approved"];

const ReportsList = () => {
    const router = useRouter();

    const status = useStaffReportsFilterStore((state) => state.status);
    const type = useStaffReportsFilterStore((state) => state.type);
    const severity = useStaffReportsFilterStore((state) => state.severity);
    const reset = useStaffReportsFilterStore((state) => state.reset);

    const query = useMyStaffReports({ status, type, severity });
    const reports = useMemo(
        () => query.data?.pages.flatMap((page) => page.data) ?? [],
        [query.data],
    );

    const hasFilters = useMemo(() => {
        return Boolean(status || type || severity);
    }, [status, type,  severity])

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
    }, [query])

    return (
        query.isLoading ? (
            <View className="flex-1 items-center justify-center gap-3">
                <LoadingIndicator size="large" />
                <Text className="text-base text-neutral-grey-1">
                    Loading reports...
                </Text>
            </View>
        ) : (
            <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <ReportCard
                report={item}
                onPress={() =>
                    router.push({
                        pathname: "/resort-staff/(reports)/[reportId]",
                        params: { reportId: item.id },
                    })
                }
                />
            )}
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
                    <LoadingIndicator className="py-5" />
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
        )
    )
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

export default ReportsList;
