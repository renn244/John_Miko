import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useCompleteAllKitchenItemsMutation, useKitchenOrderById, useUpdateKitchenItemStatusMutation } from "@/hooks/kitchenOrders.hook";
import type { KitchenOrderStatus } from "@/types/kitchenOrder.type";
import { addDays, format, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";

const formatDate = (raw?: string) => {
  if (!raw) return "—";
  const date = parseISO(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return format(date, "MMM dd, yyyy");
};

export default function KitchenOrderDetailsScreen() {
  const [isLoadingItemId, setIsLoadingItemId] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();

  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;

  const { data: order, isLoading, error, refetch, isRefetching } =
    useKitchenOrderById(orderId);
  const { mutateAsync: updateItemStatus, isPending: isUpdatingItemStatus } =
    useUpdateKitchenItemStatusMutation();
  const { mutateAsync: completeAllItems, isPending: isCompletingAllItems } =
    useCompleteAllKitchenItemsMutation();

  const checkInOut = useMemo(() => {
    const checkInRaw = order?.bookingDate;
    if (!checkInRaw) {
      return { checkIn: "—", checkOut: "—" };
    }

    const checkInDate = parseISO(checkInRaw);
    if (Number.isNaN(checkInDate.getTime())) {
      return { checkIn: checkInRaw, checkOut: checkInRaw };
    }

    const checkOutDate =
      order?.timeSlot === "OverNight" ? addDays(checkInDate, 1) : checkInDate;

    return {
      checkIn: format(checkInDate, "MMM dd, yyyy"),
      checkOut: format(checkOutDate, "MMM dd, yyyy"),
    };
  }, [order?.bookingDate, order?.timeSlot]);

  const orderSummary = useMemo(() => {
    const items = order?.items ?? [];
    const completedCount = items.filter((item) => item.status === "Completed").length;
    const pendingCount = items.length - completedCount;

    return {
      completedCount,
      pendingCount,
      allCompleted: items.length > 0 && pendingCount === 0,
    };
  }, [order?.items]);

  const handleToggleItemStatus = async (itemId: string, currentStatus: KitchenOrderStatus) => {
    if (!order?.bookingId) return;

    setIsLoadingItemId(itemId);
    await updateItemStatus({
      bookingId: order.bookingId,
      itemId,
      status: currentStatus === "Completed" ? "Pending" : "Completed",
    }, {
      onSettled: () => {
        setIsLoadingItemId(null);
      }
    });
  };

  const handleCompleteAll = () => {
    if (!order?.bookingId || orderSummary.allCompleted) return;

    Alert.alert(
      "Mark all as done?",
      "This will mark every pre-order item in this booking as completed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark all done",
          onPress: () => completeAllItems(order.bookingId),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-3 text-base text-neutral-grey-1">
            Loading order details...
          </Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (!orderId) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
        <View className="flex-1 items-center justify-center">
          <Text className="font-sans-semibold text-lg text-neutral-dark-1">
            Missing order ID
          </Text>
          <View className="mt-4 w-full">
            <Button
              variant="outline"
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Text className="text-neutral-dark-1 font-sans-semibold text-lg">
                Go back
              </Text>
            </Button>
          </View>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
        <View className="flex-1 items-center justify-center">
          <Text className="font-sans-semibold text-lg text-neutral-dark-1">
            Couldn’t load this order
          </Text>
          <Text className="mt-2 text-base text-neutral-grey-1 text-center">
            Pull-to-refresh isn’t available here yet.
          </Text>
          <View className="mt-4 w-full gap-3">
            <Button
              variant="outline"
              onPress={() => refetch()}
              disabled={isRefetching}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Text className="text-neutral-dark-1 font-sans-semibold text-lg">
                Retry
              </Text>
            </Button>
            <Button
              variant="ghost"
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Text className="text-neutral-dark-1 font-sans-semibold text-lg">
                Go back
              </Text>
            </Button>
          </View>
        </View>
      </CustomSafeAreaView>
    );
  }

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="font-sans-bold text-2xl text-neutral-dark-1">
              {order.guestName}
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              Booking ID: {order.bookingId}
            </Text>
          </View>
        </View>

        <View className="mt-5 gap-4">
          <View className="rounded-3xl bg-white px-5 py-4 shadow-sm">
            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
              Guest info
            </Text>
            <View className="mt-3 gap-1">
              <Text className="text-base text-neutral-grey-1">Name</Text>
              <Text className="text-lg text-neutral-dark-1">{order.guestName}</Text>
            </View>
            <View className="mt-3 gap-1">
              <Text className="text-base text-neutral-grey-1">Email</Text>
              <Text className="text-lg text-neutral-dark-1">
                {order.email || "—"}
              </Text>
            </View>
            <View className="mt-3 gap-1">
              <Text className="text-base text-neutral-grey-1">Contact</Text>
              <Text className="text-lg text-neutral-dark-1">
                {order.contactNo || "—"}
              </Text>
            </View>
          </View>

          <View className="rounded-3xl bg-white px-5 py-4 shadow-sm">
            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
              Booking info
            </Text>

            <View className="mt-3 flex-row gap-4">
              <View className="flex-1">
                <Text className="text-base text-neutral-grey-1">Check-in</Text>
                <Text className="text-lg text-neutral-dark-1">
                  {checkInOut.checkIn}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base text-neutral-grey-1">Check-out</Text>
                <Text className="text-lg text-neutral-dark-1">
                  {checkInOut.checkOut}
                </Text>
              </View>
            </View>

            <View className="mt-3 flex-row gap-4">
              <View className="flex-1">
                <Text className="text-base text-neutral-grey-1">Stay type</Text>
                <Text className="text-lg text-neutral-dark-1">
                  {order.timeSlot || "—"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base text-neutral-grey-1">Guests</Text>
                <Text className="text-lg text-neutral-dark-1">
                  {order.numberOfGuests ?? "—"}
                </Text>
              </View>
            </View>

            <View className="mt-3 gap-1">
              <Text className="text-base text-neutral-grey-1">Booking date</Text>
              <Text className="text-lg text-neutral-dark-1">
                {formatDate(order.bookingDate)}
              </Text>
            </View>
          </View>

          <View className="rounded-3xl bg-white px-5 py-4 shadow-sm">
            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
              Ordered meals
            </Text>

            {order.items.length > 0 ? (
              <View className="mt-3 rounded-2xl bg-neutral-soft-grey-3 px-4 py-3">
                <View className="flex-row items-center justify-between gap-3">
                  <View>
                    <Text className="font-sans-semibold text-base text-neutral-dark-1">
                      {orderSummary.completedCount}/{order.items.length} completed
                    </Text>
                    <Text className="text-sm text-neutral-grey-1">
                      {orderSummary.pendingCount} pending
                    </Text>
                  </View>

                  <Button
                    size="sm"
                    disabled={isCompletingAllItems || isUpdatingItemStatus || orderSummary.allCompleted}
                    onPress={handleCompleteAll}
                  >
                    {isCompletingAllItems ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text className="font-sans-semibold text-base text-white">
                        Done All
                      </Text>
                    )}
                  </Button>
                </View>
              </View>
            ) : null}

            {(order.items ?? []).length ? (
              <View className="mt-3 gap-3">
                {(order.items ?? []).map((item) => (
                  <View
                    key={item.id}
                    className="rounded-2xl bg-neutral-soft-grey-3 px-4 py-4 gap-3"
                  >
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1 pr-3">
                        <Text className="text-lg text-neutral-dark-1">
                          {item.name}
                        </Text>
                      </View>

                      <View className="rounded-full bg-white px-3 py-1">
                        <Text className="text-base font-sans-semibold text-neutral-dark-2">
                          x{item.quantity}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between gap-3">
                      <View className={`rounded-full px-3 py-1 ${item.status === "Completed" ? "bg-green-100" : "bg-amber-100"}`}>
                        <Text className={`font-sans-semibold text-sm ${item.status === "Completed" ? "text-green-700" : "text-amber-700"}`}>
                          {item.status}
                        </Text>
                      </View>

                      <Button
                      size="sm"
                      variant={item.status === "Completed" ? "outline" : "default"}
                      disabled={isLoadingItemId === item.id}
                      onPress={() => handleToggleItemStatus(item.id, item.status)}
                      >
                        {isLoadingItemId === item.id ? (
                          <ActivityIndicator color={item.status === "Completed" ? "#1F2937" : "#FFFFFF"} />
                        ) : (
                          <Text className={`font-sans-semibold text-base ${item.status === "Completed" ? "text-neutral-dark-1" : "text-white"}`}>
                            {item.status === "Completed" ? "Mark Pending" : "Mark Done"}
                          </Text>
                        )}
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="mt-3 text-base text-neutral-grey-1">
                No pre-order items found.
              </Text>
            )}
          </View>

          <View className="rounded-3xl bg-white px-5 py-4 shadow-sm">
            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
              Notes
            </Text>
            <Text className="mt-3 text-lg text-neutral-dark-1">
              {order.notes?.trim() ? order.notes : "—"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
