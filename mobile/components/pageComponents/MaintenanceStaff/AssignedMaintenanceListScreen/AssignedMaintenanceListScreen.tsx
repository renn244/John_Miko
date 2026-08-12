import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import { useAssignedMaintenanceSummary, useAssignedMaintenances } from "@/hooks/maintenance.hook";
import useDebouncedValue from "@/lib/useDebounce";
import {
  AlertTriangle,
  SearchX,
  Wrench
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View
} from "react-native";
import MaintenanceListHeader from "./MaintenanceListHeader";
import TicketCard from "./TicketCard";

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
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 350);

  const query = useAssignedMaintenances(scope, search);
  const summaryQuery = useAssignedMaintenanceSummary(search, scope === "active");

  const tickets = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );

  const onRefresh = useCallback(async () => {
    await Promise.all([
      query.refetch(),
      ...(scope === "active" ? [summaryQuery.refetch()] : []),
    ]);
  }, [query, scope, summaryQuery]);

  const detailHrefBase =
    scope === "active"
      ? "/maintenance-staff/(assigned)/ticket"
      : "/maintenance-staff/(history)/ticket";

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={(data) => (
          <TicketCard
            item={data.item}
            detailHref={`${detailHrefBase}/${data.item.id}`}
          />
        )}
        ListHeaderComponent={
          <MaintenanceListHeader
            scope={scope}
            title={title}
            description={description}
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            summary={summaryQuery.data}
            isSummaryLoading={summaryQuery.isLoading}
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={query.isRefetching || summaryQuery.isRefetching} onRefresh={onRefresh} />
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
          query.isLoading ? (
            <View className="pt-1">
              {[1, 2, 3].map((item) => (
                <MaintenanceSkeletonCard key={item} />
              ))}
            </View>
          ) : (
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
                  onAction={() => setSearchInput("")}
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
          )
        }
      />
    </CustomSafeAreaView>
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
