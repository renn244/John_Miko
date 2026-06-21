import PreOrderFilters from "@/components/pageComponents/Kitchen Staff/PreOrderFilters";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip from "@/components/ui/status-chip";
import { useKitchenOrders } from "@/hooks/kitchenOrders.hook";
import { useKitchenPreOrdersFilterStore } from "@/store/kitchenPreOrdersFilter.store";
import type { KitchenOrder, KitchenOrderStatus } from "@/types/kitchenOrder.type";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  Clock,
  ShoppingBag,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

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

const formatBookingReference = (bookingId: string) =>
  `Booking ID: ${bookingId}`;

const formatStayLabel = (timeSlot?: KitchenOrder["timeSlot"]) => {
  if (!timeSlot) return undefined;
  return timeSlot.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const getItemPreview = (order: KitchenOrder) => {
  const items = order.items ?? [];
  const preview = items
    .slice(0, 2)
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(" - ");
  const remaining = items.length - 2;

  return remaining > 0 ? `${preview} - +${remaining} more` : preview;
};

const getKitchenStatus = (order: KitchenOrder): KitchenOrderStatus => {
  if (order.kitchenStatus) return order.kitchenStatus;
  return order.items.length > 0 &&
    order.items.every((item) => item.status === "Completed")
    ? "Completed"
    : "Pending";
};

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
      const status = getKitchenStatus(item);
      const isCompleted = status === "Completed";
      const stayLabel = formatStayLabel(item.timeSlot);
      const itemPreview = getItemPreview(item);

      return (
        <OperationalCard
          onPress={() =>
            router.push({
              pathname: "/kitchen-staff/order/[orderId]",
              params: { orderId: item.bookingId },
            })
          }
          leftAccentClassName={
            isCompleted ? "bg-secondary-green-light" : "bg-secondary-yellow-light"
          }
          contentClassName="gap-3 px-4 py-4"
          className="mb-3 rounded-md"
        >
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="font-sans-bold text-lg text-neutral-dark-1">
                {item.guestName}
              </Text>
              <Text className="mt-1 text-sm text-neutral-grey-1">
                {formatBookingReference(item.bookingId)}
              </Text>
            </View>
            <StatusChip
              label={status}
              tone={isCompleted ? "completed" : "pending"}
              size="sm"
            />
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1.5">
              <CalendarDays size={15} color="#4D5963" />
              <Text className="text-base text-neutral-dark-2">
                {formatBookingDate(item.bookingDate)}
              </Text>
            </View>
            {stayLabel ? (
              <View className="flex-row items-center gap-1.5">
                <Clock size={15} color="#4D5963" />
                <Text className="text-base text-neutral-dark-2">
                  {stayLabel}
                </Text>
              </View>
            ) : null}
            <View className="flex-row items-center gap-1.5">
              <ShoppingBag size={15} color="#4D5963" />
              <Text className="text-base text-neutral-dark-2">
                {totalItems} item{totalItems === 1 ? "" : "s"}
              </Text>
            </View>
          </View>

          {itemPreview ? (
            <View className="rounded-sm bg-neutral-soft-grey-3 px-3 py-2">
              <Text
                numberOfLines={2}
                className="text-base leading-5 text-neutral-dark-2"
              >
                {itemPreview}
              </Text>
            </View>
          ) : null}
        </OperationalCard>
      );
    },
    [router]
  );

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="gap-4 border-b border-neutral-soft-grey-2 px-5 pb-4 pt-4">
        <View>
          <Text className="font-sans-bold text-3xl text-neutral-dark-1">
            Kitchen queue
          </Text>
          <Text className="mt-1 text-base text-neutral-grey-1">
            Guest meal pre-orders ready for preparation.
          </Text>
        </View>

        <PreOrderFilters />
      </View>

      {isLoading ? (
        <View className="gap-3 px-5 pt-5">
          <Text className="text-base text-neutral-grey-1">
            Loading pre-orders...
          </Text>
          {[0, 1, 2, 3].map((item) => (
            <View
              key={item}
              className="h-28 rounded-md border border-neutral-soft-grey-2 bg-white"
            >
              <View className="h-full w-1 bg-secondary-blue-light" />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.bookingId}
          renderItem={renderOrder}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 28,
            paddingTop: 16,
            flexGrow: filteredOrders.length === 0 ? 1 : undefined,
          }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-2">
              <ScreenState
                tone={error ? "danger" : "info"}
                icon={
                  error ? (
                    <AlertTriangle size={24} color="#AB091E" />
                  ) : (
                    <ClipboardList size={24} color="#0E33F3" />
                  )
                }
                title={error ? "Could not load pre-orders" : "No pre-orders found"}
                description={
                  error
                    ? "There was a problem connecting to the kitchen display system."
                    : "Try changing the search or date filter."
                }
                actionLabel={error ? "Retry" : undefined}
                onAction={error ? () => refetch() : undefined}
              />
            </View>
          }
        />
      )}
    </CustomSafeAreaView>
  );
}
