import OperationalCard from "@/components/ui/operational-card";
import StatusChip from "@/components/ui/status-chip";
import { KitchenOrder } from "@/types/kitchenOrder.type";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { CalendarDays, Clock, ShoppingBag } from "lucide-react-native";
import { Text, View } from "react-native";

type PreOrderCardProps = {
  item: KitchenOrder;
}

const formatBookingReference = (referenceCode: string) =>
  `Booking reference: ${referenceCode}`;

const getItemPreview = (order: KitchenOrder) => {
  const items = order.items ?? [];
  const preview = items
    .slice(0, 2)
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(" - ");
  const remaining = items.length - 2;

  return remaining > 0 ? `${preview} - +${remaining} more` : preview;
};

const PreOrderCard = ({ item }: PreOrderCardProps) => {
  const router = useRouter();

  const totalItems = (item.items ?? []).reduce((total, item) => total + (item.quantity || 0), 0);
  const status = item.kitchenStatus || "Pending";
  const isCompleted = status === "Completed";
  const stayLabel = item.timeSlot;
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
            {formatBookingReference(item.referenceCode)}
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
            {format(new Date(item.bookingDate), "MMM dd, yyyy")}
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
  )
}

export default PreOrderCard;
