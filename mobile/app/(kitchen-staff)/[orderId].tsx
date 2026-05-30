import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useKitchenOrderById } from "@/hooks/kitchenOrders.hook";
import { addDays, format, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
    ActivityIndicator,
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
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();

  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;

  const { data: order, isLoading, error, refetch, isRefetching } =
    useKitchenOrderById(orderId);

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

            {(order.items ?? []).length ? (
              <View className="mt-3 gap-3">
                {(order.items ?? []).map((item) => (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-1 pr-3">
                      <Text className="text-lg text-neutral-dark-1">
                        {item.name}
                      </Text>
                    </View>
                    <View className="rounded-full bg-neutral-soft-grey-2 px-3 py-1">
                      <Text className="text-base font-sans-semibold text-neutral-dark-2">
                        x{item.quantity}
                      </Text>
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
