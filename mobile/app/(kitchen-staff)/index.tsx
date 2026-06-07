import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useKitchenOrders } from "@/hooks/kitchenOrders.hook";
import { useKitchenPreOrdersFilterStore } from "@/store/kitchenPreOrdersFilter.store";
import type { KitchenOrder } from "@/types/kitchenOrder.type";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import PreOrderFilters from "../../components/pageComponents/Kitchen Staff/PreOrderFilters";

const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, value]);

  return debounced;
}

const formatBookingDate = (raw: string) => {
  const date = parseISO(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return format(date, "MMM dd, yyyy");
};

const getTotalItems = (order: KitchenOrder) =>
  (order.items ?? []).reduce((total, item) => total + (item.quantity || 0), 0);

export default function KitchenStaffPreOrdersScreen() {
  const router = useRouter();

  const search = useKitchenPreOrdersFilterStore((s) => s.search);
  const date = useKitchenPreOrdersFilterStore((s) => s.date);

  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const debouncedDate = useDebouncedValue(date.trim(), 350);

  const dateParam = useMemo(() => {
    const candidate = debouncedDate.trim();
    if (!candidate) return undefined;
    return isDateOnly(candidate) ? candidate : undefined;
  }, [debouncedDate]);

  const {
    data: orders,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useKitchenOrders({
    search: debouncedSearch || undefined,
    date: dateParam,
  });

  const filteredOrders = useMemo(() => orders ?? [], [orders]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const renderOrder = useCallback(
    ({ item }: { item: KitchenOrder }) => {
      const totalItems = getTotalItems(item);

      return (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(kitchen-staff)/[orderId]",
              params: { orderId: item.orderId },
            })
          }
          className="mb-3 rounded-3xl bg-white px-5 py-4 shadow-sm"
        >
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                {item.guestName}
              </Text>
              <Text className="text-base text-neutral-grey-1 mt-1">
                {formatBookingDate(item.bookingDate)}
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-base text-neutral-grey-1">
              Booking ID: {item.bookingId}
            </Text>
            <Text className="text-base font-sans-semibold text-neutral-dark-2">
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </Text>
          </View>
        </Pressable>
      );
    },
    [router]
  );

  return (
    <CustomSafeAreaView className="bg-neutral-soft-grey-3">
      <View className="px-4 pt-4 pb-3 gap-3">
        <View>
          <Text className="font-sans-bold text-2xl text-neutral-dark-1">
            Pre-orders
          </Text>
          <Text className="text-base text-neutral-grey-1 mt-1">
            Reservations with meals to prepare
          </Text>
        </View>

        <PreOrderFilters />
      </View>

        {isLoading ? (
            <View className="mt-4 w-full px-6 pb-6 pt-12 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        ) : (
            <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.orderId}
            renderItem={renderOrder}
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 24,
                paddingTop: 6,
            }}
            refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
                <View className="items-center justify-center py-12">
                    <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                        No pre-orders found
                    </Text>
                    <Text className="mt-2 text-base text-neutral-grey-1 text-center">
                        Try changing the filters or pull to refresh.
                    </Text>
                    {error ? (
                        <View className="mt-4 w-full">
                            <Button
                            variant="outline"
                            onPress={() => refetch()}
                            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                            >
                            <Text className="text-neutral-dark-1 font-sans-semibold text-lg">
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
