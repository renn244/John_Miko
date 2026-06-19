import ReportBadge from "@/components/pageComponents/Resort Staff/ReportBadge";
import {
  reportSeverityClasses,
  reportStatusClasses,
  reportTypeLabels,
} from "@/components/pageComponents/Resort Staff/reportDisplay";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useMyStaffReports } from "@/hooks/staffReports.hook";
import { useStaffReportsFilterStore } from "@/store/staffReportsFilter.store";
import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
  StaffReport,
} from "@/types/staffReport.type";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { Plus, RotateCcw } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

const formatCreatedAt = (value: string) => {
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "MMM dd, yyyy h:mm a");
};

export default function MyStaffReportsScreen() {
  const router = useRouter();
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

  const onRefresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const renderReport = useCallback(
    ({ item }: { item: StaffReport }) => (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/resort-staff/reports/[reportId]",
            params: { reportId: item.id },
          })
        }
        className="mb-3 rounded-3xl bg-white px-5 py-4 shadow-sm"
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text
              numberOfLines={2}
              className="font-sans-semibold text-xl text-neutral-dark-1"
            >
              {item.title}
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              {formatCreatedAt(item.createdAt)}
            </Text>
          </View>
          <ReportBadge
            label={item.status}
            className={reportStatusClasses[item.status]}
          />
        </View>

        <View className="mt-4 flex-row flex-wrap gap-2">
          <ReportBadge
            label={reportTypeLabels[item.type]}
            className="bg-neutral-soft-grey-2 text-neutral-dark-2"
          />
          <ReportBadge
            label={`${item.severity} severity`}
            className={reportSeverityClasses[item.severity]}
          />
        </View>

        <Text numberOfLines={2} className="mt-3 text-base text-neutral-grey-1">
          {item.description}
        </Text>
      </Pressable>
    ),
    [router],
  );

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="px-5 pb-3 pt-4">
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
            onPress={() => router.push("/resort-staff/new-report")}
          >
            <Plus size={21} color="#FFFFFF" />
          </Button>
        </View>

        <View className="mt-4 gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Select
                value={status ?? "all"}
                onValueChange={(value) =>
                  setStatus(value === "all" ? undefined : (value as ReportStatus))
                }
                size="sm"
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </View>
            <View className="flex-1">
              <Select
                value={type ?? "all"}
                onValueChange={(value) =>
                  setType(value === "all" ? undefined : (value as ReportType))
                }
                size="sm"
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="checkIn">Check-in</SelectItem>
                  <SelectItem value="checkOut">Check-out</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Select
                value={severity ?? "all"}
                onValueChange={(value) =>
                  setSeverity(
                    value === "all" ? undefined : (value as ReportSeverity),
                  )
                }
                size="sm"
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </View>
            <Button variant="outline" size="sm" onPress={reset} className="flex-1">
              <RotateCcw size={17} color="#1F2933" />
              <Text className="font-sans-semibold text-base text-neutral-dark-1">
                Reset
              </Text>
            </Button>
          </View>
        </View>
      </View>

      {query.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-base text-neutral-grey-1">
            Loading reports...
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderReport}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 28,
            paddingTop: 8,
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
            <View className="flex-1 items-center justify-center px-6">
              <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                {query.error ? "Could not load reports" : "No reports found"}
              </Text>
              <Text className="mt-2 text-center text-base text-neutral-grey-1">
                {query.error
                  ? "Check your connection and try again."
                  : "Submit a report or change the selected filters."}
              </Text>
              <View className="mt-4 w-full">
                <Button
                  variant="outline"
                  onPress={() =>
                    query.error
                      ? query.refetch()
                      : router.push("/resort-staff/new-report")
                  }
                >
                  <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                    {query.error ? "Retry" : "Create report"}
                  </Text>
                </Button>
              </View>
            </View>
          }
        />
      )}
    </CustomSafeAreaView>
  );
}
