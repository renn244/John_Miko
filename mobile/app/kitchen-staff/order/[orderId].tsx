import BookingContact from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/BookingContact";
import BookingInfo from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/BookingInfo";
import BookingNote from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/BookingNote";
import BookingTimeline from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/BookingTimeline";
import PreOrderItemList from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/PreOrderList";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import ScreenState from "@/components/ui/screen-state";
import {
  useKitchenOrderById
} from "@/hooks/kitchenOrders.hook";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  ClipboardList
} from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

export default function KitchenOrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();

  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;

  const { data: order, isLoading, error, refetch, isRefetching } =  useKitchenOrderById(orderId);

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (!orderId) {
    return (
      <NotFoundState router={router} />
    );
  }

  if (error || !order) {
    return (
      <ErrorState refetch={refetch} isRefetching={isRefetching} router={router} />
    );
  }

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

        <BookingInfo order={order} />

        {order.notes?.trim() ? (
          <BookingNote notes={order.notes.trim()} />
        ) : null}

        <PreOrderItemList order={order} />

        <BookingContact order={order} />

        <BookingTimeline order={order} />

      </ScrollView>
    </CustomSafeAreaView>
  );
}

const LoadingState = () => {
  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <ActivityIndicator />
        <Text className="text-center text-base text-neutral-grey-1">
          Loading order details...
        </Text>
      </View>
    </CustomSafeAreaView>
  )
}

const NotFoundState = ({
  router
}: {
  router: ReturnType<typeof useRouter>
}) => {
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
  )
}

const ErrorState = ({
  refetch,
  isRefetching,
  router
}: {
  refetch: () => void;
  isRefetching: boolean;
  router: ReturnType<typeof useRouter>;
}) => {
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
  )
}