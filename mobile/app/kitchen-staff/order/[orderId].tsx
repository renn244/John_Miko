import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import {
  useCompleteAllKitchenItemsMutation,
  useKitchenOrderById,
  useUpdateKitchenItemStatusMutation,
} from "@/hooks/kitchenOrders.hook";
import { getBookingStayDates } from "@/lib/bookingStay";
import type { KitchenOrderStatus } from "@/types/kitchenOrder.type";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCheck,
  ClipboardList,
  Clock3,
  Mail,
  Phone,
  Users,
  UtensilsCrossed,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const missingText = "-";

const statusTone: Record<KitchenOrderStatus, StatusChipTone> = {
  Pending: "pending",
  Completed: "completed",
};

const itemAccentClassName: Record<KitchenOrderStatus, string> = {
  Pending: "bg-secondary-yellow-light",
  Completed: "bg-secondary-green-light",
};

const formatStayLabel = (value?: string | null) => {
  if (!value) return missingText;
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
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
      return { checkIn: missingText, checkOut: missingText };
    }

    const hasScheduleTimes = Boolean(order?.startTime && order?.endTime);
    const { checkIn, checkOut } = getBookingStayDates({
      bookingDate: checkInRaw,
      startTime: order?.startTime,
      endTime: order?.endTime,
    });

    const formatTimelineDate = (date: Date) =>
      format(date, hasScheduleTimes ? "MMM dd, yyyy - h:mm a" : "MMM dd, yyyy");

    return {
      checkIn: formatTimelineDate(checkIn),
      checkOut: hasScheduleTimes ? formatTimelineDate(checkOut) : "Time not set",
    };
  }, [order?.bookingDate, order?.endTime, order?.startTime]);

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

  const orderStatus: KitchenOrderStatus =
    order?.kitchenStatus ?? (orderSummary.allCompleted ? "Completed" : "Pending");

  const handleToggleItemStatus = async (
    itemId: string,
    currentStatus: KitchenOrderStatus
  ) => {
    if (!order?.bookingId) return;

    setIsLoadingItemId(itemId);
    await updateItemStatus(
      {
        bookingId: order.bookingId,
        itemId,
        status: currentStatus === "Completed" ? "Pending" : "Completed",
      },
      {
        onSettled: () => {
          setIsLoadingItemId(null);
        },
      }
    );
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
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <ActivityIndicator />
          <Text className="text-center text-base text-neutral-grey-1">
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
          <ScreenState
            icon={<ClipboardList size={24} color="#0E33F3" />}
            tone="info"
            title="Missing order ID"
            description="This order link is incomplete."
            actionLabel="Go back"
            onAction={() => router.back()}
          />
        </View>
      </CustomSafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
        <View className="flex-1 items-center justify-center">
          <ScreenState
            icon={<AlertTriangle size={24} color="#AB091E" />}
            tone="danger"
            title="Could not load this order"
            description="Check your connection and try again."
            actionLabel={isRefetching ? "Retrying..." : "Retry"}
            onAction={() => refetch()}
          />
          <Button variant="outline" onPress={() => router.back()} className="mt-2 w-full">
            <Text className="font-sans-semibold text-base text-primary">
              Go back
            </Text>
          </Button>
        </View>
      </CustomSafeAreaView>
    );
  }

  const hasItems = order.items.length > 0;
  const stayLabel = formatStayLabel(order.timeSlot);

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 28,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-9 w-9 items-center justify-center rounded-full"
          >
            <ArrowLeft size={21} color="#1F2937" />
          </Pressable>
          <Text className="font-sans-bold text-xl text-neutral-dark-1">
            Kitchen order
          </Text>
        </View>

        <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-4 px-4 py-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1.5">
              <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
                Meal preparation
              </Text>
              <Text className="font-sans-bold text-xl text-neutral-dark-1">
                {order.guestName}
              </Text>
              <Text className="text-base text-neutral-grey-1">
                Booking ID: {order.bookingId}
              </Text>
            </View>
            <StatusChip
              label={orderStatus}
              tone={statusTone[orderStatus]}
              size="sm"
              icon={<Clock3 size={12} color={orderStatus === "Completed" ? "#047857" : "#4B5563"} />}
            />
          </View>

          <View className="flex-row flex-wrap gap-2">
            <ContextPill
              icon={<Users size={13} color="#1F2937" />}
              label={`${order.numberOfGuests ?? 0} guests`}
            />
            <ContextPill
              icon={<Clock3 size={13} color="#1F2937" />}
              label={stayLabel}
            />
            <ContextPill
              icon={<UtensilsCrossed size={13} color="#1F2937" />}
              label={`${order.items.length} meal ${order.items.length === 1 ? "item" : "items"}`}
            />
          </View>
        </OperationalCard>

        {order.notes?.trim() ? (
          <OperationalCard
            leftAccentClassName="bg-system-red"
            className="bg-secondary-blue-light/40"
            contentClassName="gap-2 px-4 py-4"
          >
            <View className="flex-row items-start gap-3">
              <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-system-red/10">
                <AlertTriangle size={16} color="#AB091E" />
              </View>
              <View className="flex-1 gap-1">
                <Text className="font-sans-bold text-lg text-neutral-dark-1">
                  Dietary / service note
                </Text>
                <Text className="text-base leading-5 text-neutral-dark-2">
                  {order.notes.trim()}
                </Text>
              </View>
            </View>
          </OperationalCard>
        ) : null}

        <View className="gap-3">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="font-sans-bold text-xl text-neutral-dark-1">
                Meal checklist
              </Text>
              <Text className="mt-1 text-base text-neutral-grey-1">
                {orderSummary.completedCount} of {order.items.length} completed
              </Text>
            </View>

            <StatusChip
              label={`${orderSummary.pendingCount} pending`}
              tone={orderSummary.pendingCount > 0 ? "pending" : "completed"}
              size="sm"
            />
          </View>

          {hasItems ? (
            <Pressable
              onPress={handleCompleteAll}
              disabled={
                isCompletingAllItems ||
                isUpdatingItemStatus ||
                orderSummary.allCompleted
              }
              className="self-start flex-row items-center gap-2"
              style={({ pressed }) => ({
                opacity:
                  pressed ||
                  isCompletingAllItems ||
                  isUpdatingItemStatus ||
                  orderSummary.allCompleted
                    ? 0.55
                    : 1,
              })}
            >
              <CheckCheck size={15} color="#4B5563" />
              <Text className="font-sans-semibold text-base text-neutral-grey-1">
                Mark all done
              </Text>
            </Pressable>
          ) : null}

          {hasItems ? (
            <View className="gap-2">
              {order.items.map((item) => {
                const isCompleted = item.status === "Completed";
                const isLoadingThisItem = isLoadingItemId === item.id;

                return (
                  <OperationalCard
                    key={item.id}
                    leftAccentClassName={itemAccentClassName[item.status]}
                    contentClassName="gap-0 px-3 py-2.5"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="flex-1">
                        <Text
                          className={`font-sans-semibold text-lg text-neutral-dark-1 ${
                            isCompleted ? "line-through text-neutral-grey-1" : ""
                          }`}
                        >
                          {item.name}
                        </Text>
                      </View>

                      <View className="rounded-md bg-secondary-blue-light px-3 py-2">
                        <Text className="font-sans-bold text-base text-neutral-dark-2">
                          x{item.quantity}
                        </Text>
                      </View>

                      <Button
                        size="sm"
                        variant={isCompleted ? "outline" : "default"}
                        disabled={isLoadingThisItem}
                        onPress={() => handleToggleItemStatus(item.id, item.status)}
                        className={isCompleted ? "px-4" : "px-5"}
                      >
                        {isLoadingThisItem ? (
                          <ActivityIndicator
                            color={isCompleted ? "#111827" : "#FFFFFF"}
                          />
                        ) : (
                          <Text
                            className={`font-sans-semibold text-base ${
                              isCompleted ? "text-neutral-dark-1" : "text-white"
                            }`}
                          >
                            {isCompleted ? "Undo" : "Mark"}
                          </Text>
                        )}
                      </Button>
                    </View>
                  </OperationalCard>
                );
              })}
            </View>
          ) : (
            <OperationalCard contentClassName="items-center gap-4 px-4 py-8">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-secondary-blue-light">
                <UtensilsCrossed size={26} color="#6B7280" />
              </View>
              <View className="items-center gap-1">
                <Text className="text-center font-sans-bold text-xl text-neutral-dark-1">
                  No pre-order items found
                </Text>
                <Text className="text-center text-base leading-5 text-neutral-grey-1">
                  This booking has no meal items to prepare.
                </Text>
              </View>
              <Button onPress={() => router.replace("/kitchen-staff")}>
                <Text className="font-sans-semibold text-base text-white">
                  Return to Dashboard
                </Text>
              </Button>
            </OperationalCard>
          )}
        </View>

        <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-3 px-4 py-4">
          <SectionTitle
            icon={<ClipboardList size={17} color="#0E33F3" />}
            title="Guest contact"
          />
          <View className="gap-2.5">
            <ContactRow
              icon={<Phone size={15} color="#0E33F3" />}
              label="Phone"
              text={order.contactNo || "No contact number"}
            />
            <ContactRow
              icon={<Mail size={15} color="#0E33F3" />}
              label="Email"
              text={order.email || "No email available"}
            />
          </View>
        </OperationalCard>

        <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-3 px-4 py-4">
          <SectionTitle title="Reservation timeline" />
          <View>
            <TimelineItem active label="Check-in" dateTime={checkInOut.checkIn} />
            <TimelineItem label="Check-out" dateTime={checkInOut.checkOut} isLast />
          </View>
        </OperationalCard>
      </ScrollView>
    </CustomSafeAreaView>
  );
}

function ContextPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-md bg-neutral-soft-grey-3 px-2.5 py-1.5">
      {icon}
      <Text className="font-sans-semibold text-sm text-neutral-dark-2">
        {label}
      </Text>
    </View>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon?: React.ReactNode;
  title: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      {icon}
      <Text className="font-sans-bold text-lg text-neutral-dark-1">{title}</Text>
    </View>
  );
}

function ContactRow({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <View className="flex-row items-center gap-3 rounded-md bg-neutral-soft-grey-3 px-3 py-2.5">
      <View className="h-8 w-8 items-center justify-center rounded-md bg-secondary-blue-light">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
          {label}
        </Text>
        <Text className="text-base text-neutral-dark-2">{text}</Text>
      </View>
    </View>
  );
}

function TimelineItem({
  active,
  label,
  dateTime,
  isLast,
}: {
  active?: boolean;
  label: string;
  dateTime: string;
  isLast?: boolean;
}) {
  return (
    <View className="flex-row gap-3">
      <View className="items-center">
        <View
          className={`h-4 w-4 rounded-full ${
            active ? "border-4 border-primary" : "border-2 border-neutral-soft-grey-1"
          }`}
        />
        {!isLast ? <View className="h-10 w-px bg-neutral-soft-grey-1" /> : null}
      </View>
      <View className="flex-1 pb-4">
        <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
          {label}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <CalendarDays size={14} color="#111827" />
          <Text className="font-sans-semibold text-base text-neutral-dark-1">
            {dateTime}
          </Text>
        </View>
      </View>
    </View>
  );
}
