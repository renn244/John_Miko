import type { KitchenOrder } from "@/types/kitchenOrder.type";
import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

import { formatBookingDate, getTotalItems } from "@/app/(kitchen-staff)/components/preOrders.utils";

type PreOrderCardProps = {
  order: KitchenOrder;
  onPress?: () => void;
  className?: string;
};

export default function PreOrderCard({ order, onPress, className }: PreOrderCardProps) {
  const totalItems = getTotalItems(order);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      className={twMerge(
        "rounded-3xl bg-white px-5 py-4 shadow-sm",
        className
      )}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text
            className="font-sans-semibold text-xl text-neutral-dark-1"
            numberOfLines={1}
          >
            {order.guestName}
          </Text>
          <Text className="text-base text-neutral-grey-1 mt-1">
            {formatBookingDate(order.bookingDate)}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-neutral-soft-grey-2 px-3 py-1">
            <Text className="text-base font-sans-semibold text-neutral-dark-2">
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </Text>
          </View>
          <ChevronRight size={18} color="#9FA8B1" />
        </View>
      </View>

      <Text
        className="mt-3 text-base text-neutral-grey-1"
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        Booking ID: {order.bookingId}
      </Text>
    </Pressable>
  );
}
