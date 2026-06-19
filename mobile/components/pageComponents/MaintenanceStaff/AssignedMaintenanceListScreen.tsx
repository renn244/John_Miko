import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { Input } from "@/components/ui/input";
import { useAssignedMaintenances } from "@/hooks/maintenance.hook";
import type { AssignedMaintenance } from "@/types/maintenance.type";
import { format } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

const formatShortDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "MMM dd, yyyy");
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

  const onRefresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const renderTicket = useCallback(
    ({ item }: { item: AssignedMaintenance }) => (
      <Pressable
        onPress={() => router.push(`/maintenance-staff/${item.id}` as any)}
        className="mb-3 rounded-3xl bg-white px-5 py-4 shadow-sm"
      >
        <View className="flex-row items-start gap-3">
          {item.imagesUrl?.[0] ? (
            <Image
              source={item.imagesUrl[0]}
              contentFit="cover"
              style={{ width: 72, height: 72, borderRadius: 18 }}
            />
          ) : (
            <View className="h-[72px] w-[72px] rounded-[18px] bg-neutral-soft-grey-2" />
          )}

          <View className="flex-1">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                  {item.title}
                </Text>
                <Text className="mt-1 text-base text-neutral-grey-1">
                  {item.id}
                </Text>
              </View>

              <View className="rounded-full bg-primary/10 px-3 py-1">
                <Text className="font-sans-semibold text-sm text-primary">
                  {item.priority}
                </Text>
              </View>
            </View>

            <Text className="mt-2 text-base text-neutral-grey-1">
              {item.expertise} • {item.status === "InProgress" ? "In Progress" : item.status}
            </Text>

            <Text className="mt-2 text-sm text-neutral-grey-1">
              {formatShortDate(getRelevantDate(item))}
            </Text>
          </View>
        </View>
      </Pressable>
    ),
    [router],
  );

  return (
    <CustomSafeAreaView className="bg-neutral-soft-grey-3">
      <View className="px-4 pb-3 pt-4">
        <Text className="font-sans-bold text-2xl text-neutral-dark-1">{title}</Text>
        <Text className="mt-1 text-base text-neutral-grey-1">{description}</Text>

        <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Search size={18} color="#7B8794" />
          <Input
            className="flex-1 border-0 bg-transparent px-0"
            placeholder="Search by ticket ID or title"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {query.isLoading ? (
        <View className="items-center justify-center px-6 pt-12">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicket}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 6 }}
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
            <View className="items-center justify-center py-12">
              <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                {emptyTitle}
              </Text>
              <Text className="mt-2 text-center text-base text-neutral-grey-1">
                {emptyDescription}
              </Text>
              {query.error ? (
                <View className="mt-4 w-full">
                  <Button variant="outline" onPress={() => query.refetch()}>
                    <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                      Retry
                    </Text>
                  </Button>
                </View>
              ) : null}
            </View>
          }
        />
      )}
    </CustomSafeAreaView>
  );
}
