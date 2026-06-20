import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { Input } from "@/components/ui/input";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import { useAssignedMaintenances } from "@/hooks/maintenance.hook";
import type {
  AssignedMaintenance,
  MaintenancePriority,
  MaintenanceStatus,
} from "@/types/maintenance.type";
import { format, isToday, isYesterday } from "date-fns";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  ChevronRight,
  Search,
  SearchX,
  Wrench,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

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

const priorityAccentClassName: Record<MaintenancePriority, string> = {
  Low: "bg-primary",
  Medium: "bg-secondary-yellow-light",
  High: "bg-system-red",
};

const statusLabel: Record<MaintenanceStatus, string> = {
  Pending: "Pending",
  InProgress: "In Progress",
  Completed: "Completed",
  Closed: "Closed",
};

const formatDateLabel = (value?: string | null) => {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  if (isToday(date)) return "today";
  if (isYesterday(date)) return "yesterday";
  return format(date, "MMM dd");
};

const formatTime = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return format(date, "h:mm a");
};

const formatDateTimeLabel = (value?: string | null) => {
  const dateLabel = formatDateLabel(value);
  const timeLabel = formatTime(value);
  return `${dateLabel}${timeLabel ? `, ${timeLabel}` : ""}`;
};

const getRelevantDate = (ticket: AssignedMaintenance) => {
  switch (ticket.status) {
    case "Pending":
      return ticket.createdAt;
    case "InProgress":
      return ticket.startedAt ?? ticket.createdAt;
    case "Completed":
      return ticket.resolvedAt ?? ticket.updatedAt;
    case "Closed":
      return ticket.closedAt ?? ticket.updatedAt;
  }
};

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs, value]);

  return debounced;
}

type AssignedMaintenanceListScreenProps = {
  scope: "active" | "history";
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

export default function AssignedMaintenanceListScreen({
  scope,
  title,
  description,
  emptyTitle,
  emptyDescription,
}: AssignedMaintenanceListScreenProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);

  const query = useAssignedMaintenances(scope, debouncedSearch);

  const tickets = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );

  const summary = useMemo(() => {
    return {
      pending: tickets.filter((ticket) => ticket.status === "Pending").length,
      inProgress: tickets.filter((ticket) => ticket.status === "InProgress").length,
      high: tickets.filter((ticket) => ticket.priority === "High").length,
    };
  }, [tickets]);

  const onRefresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const renderTicket = useCallback(
    ({ item }: { item: AssignedMaintenance }) => {
      const relevantDate = getRelevantDate(item);

      return (
        <OperationalCard
          onPress={() => router.push(`/maintenance-staff/${item.id}` as any)}
          leftAccentClassName={priorityAccentClassName[item.priority]}
          contentClassName="gap-3 px-4 py-4"
          className="mx-5 mb-3"
        >
          <View className="flex-row items-start gap-3">
            <View className="flex-1 gap-2">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Text
                      className="flex-1 font-sans-bold text-sm text-neutral-grey-1"
                      numberOfLines={1}
                    >
                      ID: {item.id}
                    </Text>
                    <StatusChip
                      label={item.priority}
                      tone={priorityTone[item.priority]}
                      size="sm"
                      uppercase
                    />
                  </View>

                  <Text className="mt-2 font-sans-bold text-xl text-neutral-dark-1">
                    {item.title}
                  </Text>
                </View>

                <ChevronRight size={22} color="#6B7280" />
              </View>

              <Text className="text-base leading-5 text-neutral-dark-2" numberOfLines={2}>
                {item.description}
              </Text>

              <View className="h-px bg-neutral-soft-grey-2" />

              <View className="flex-row items-center justify-between gap-3">
                <View className="min-w-0 flex-1">
                  <Text
                    className="flex-1 font-sans-semibold text-base text-neutral-grey-1"
                    numberOfLines={1}
                  >
                    {formatDateTimeLabel(relevantDate)}
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <StatusChip
                    label={statusLabel[item.status]}
                    tone={statusTone[item.status]}
                    size="sm"
                  />
                  <StatusChip
                    label={item.expertise}
                    tone="info"
                    size="sm"
                  />
                </View>
              </View>
            </View>
          </View>
        </OperationalCard>
      );
    },
    [router],
  );

  const renderHeader = () => (
    <View className="gap-4 px-5 pb-3 pt-4">
      <View>
        <Text className="font-sans-bold text-3xl text-neutral-dark-1">{title}</Text>
        <Text className="mt-2 text-lg leading-6 text-neutral-grey-1">{description}</Text>
      </View>

      <Input
        leftIcon={<Search size={20} color="#6B7280" />}
        surface="white"
        className="text-base"
        placeholder="Search ticket ID or title"
        value={search}
        onChangeText={setSearch}
      />

      {scope === "active" && tickets.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 20 }}
        >
          <SummaryPill
            label="Pending"
            value={summary.pending}
            tone="info"
          />
          <SummaryPill
            label="In Progress"
            value={summary.inProgress}
            tone="info"
          />
          <SummaryPill
            label="High Priority"
            value={summary.high}
            tone="high"
          />
        </ScrollView>
      ) : null}
    </View>
  );

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      {query.isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => String(item)}
          ListHeaderComponent={renderHeader}
          renderItem={() => <MaintenanceSkeletonCard />}
          contentContainerStyle={{ paddingBottom: 24, gap: 0 }}
        />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicket}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={query.isRefetching} onRefresh={onRefresh} />
          }
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
              query.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="px-5 py-8">
              {query.error ? (
                <ScreenState
                  icon={<AlertTriangle size={24} color="#AB091E" />}
                  tone="danger"
                  title="Could not load maintenance"
                  description="Check your connection and try again."
                  actionLabel="Retry"
                  onAction={() => query.refetch()}
                />
              ) : search.trim() ? (
                <ScreenState
                  icon={<SearchX size={24} color="#6B7280" />}
                  tone="neutral"
                  title="No tickets found"
                  description="Try a different ticket ID or title."
                  actionLabel="Clear search"
                  onAction={() => setSearch("")}
                />
              ) : (
                <ScreenState
                  icon={<Wrench size={24} color="#6B7280" />}
                  tone="info"
                  title={emptyTitle}
                  description={emptyDescription}
                />
              )}
            </View>
          }
        />
      )}
    </CustomSafeAreaView>
  );
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: StatusChipTone;
}) {
  return (
    <View
      className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
        tone === "high"
          ? "border-system-red/20 bg-system-red/10"
          : "border-secondary-blue-light bg-secondary-blue-light"
      }`}
    >
      <Text
        className={`font-sans-semibold text-base ${
          tone === "high" ? "text-secondary-red-dark" : "text-neutral-dark-1"
        }`}
      >
        {label}
      </Text>
      <Text
        className={`font-sans-semibold text-base ${
          tone === "high" ? "text-secondary-red-dark" : "text-neutral-dark-1"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}

function MaintenanceSkeletonCard() {
  return (
    <OperationalCard leftAccentClassName="bg-secondary-blue-light" contentClassName="gap-4 px-4 py-4" className="mx-5 mb-3">
      <View className="flex-row items-start justify-between">
        <View className="h-5 w-28 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-8 w-24 rounded-full bg-neutral-soft-grey-2" />
      </View>
      <View className="h-6 w-56 rounded-md bg-neutral-soft-grey-2" />
      <View className="gap-2">
        <View className="h-4 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-4 w-4/5 rounded-md bg-neutral-soft-grey-2" />
      </View>
      <View className="h-px bg-neutral-soft-grey-2" />
      <View className="flex-row items-center justify-between">
        <View className="h-4 w-32 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-4 w-16 rounded-md bg-neutral-soft-grey-2" />
      </View>
    </OperationalCard>
  );
}
