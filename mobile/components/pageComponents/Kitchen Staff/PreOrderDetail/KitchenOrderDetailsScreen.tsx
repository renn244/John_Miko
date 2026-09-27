import BookingContact from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/BookingContact";
import BookingInfo from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/BookingInfo";
import BookingNote from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/BookingNote";
import BookingTimeline from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/BookingTimeline";
import PreOrderItemList from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/PreOrderList";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import DetailPageHeader from "@/components/ui/detail-page-header";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import ScreenState from "@/components/ui/screen-state";
import { useKitchenOrderById } from "@/hooks/kitchenOrders.hook";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle, ClipboardList } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

type KitchenOrderDetailsScreenProps = {
  fallbackHref: "/kitchen-staff/(queue)" | "/kitchen-staff/(history)";
};

type DetailStateProps = KitchenOrderDetailsScreenProps & {
  router: ReturnType<typeof useRouter>;
};

const navigateBack = (
  router: ReturnType<typeof useRouter>,
  fallbackHref: KitchenOrderDetailsScreenProps["fallbackHref"],
) => {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackHref);
};

export default function KitchenOrderDetailsScreen({
  fallbackHref,
}: KitchenOrderDetailsScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;
  const { data: order, isLoading, error, refetch, isRefetching } = useKitchenOrderById(orderId);

  if (isLoading) return <LoadingState router={router} fallbackHref={fallbackHref} />;
  if (!orderId) return <NotFoundState router={router} fallbackHref={fallbackHref} />;
  if (error || !order) {
    return <ErrorState refetch={refetch} isRefetching={isRefetching} router={router} fallbackHref={fallbackHref} />;
  }

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <DetailPageHeader onBack={() => navigateBack(router, fallbackHref)} title="Kitchen order" metadata={`Reference: ${order.referenceCode}`} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28, gap: 12 }} showsVerticalScrollIndicator={false}>
        <BookingInfo order={order} />
        {order.notes?.trim() ? <BookingNote notes={order.notes.trim()} /> : null}
        <PreOrderItemList order={order} />
        <BookingContact order={order} />
        <BookingTimeline order={order} />
      </ScrollView>
    </CustomSafeAreaView>
  );
}

function LoadingState({ router, fallbackHref }: DetailStateProps) {
  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <DetailPageHeader onBack={() => navigateBack(router, fallbackHref)} title="Kitchen order" />
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <LoadingIndicator />
        <Text className="text-center text-base text-neutral-grey-1">Loading order details...</Text>
      </View>
    </CustomSafeAreaView>
  );
}

function NotFoundState({ router, fallbackHref }: DetailStateProps) {
  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
      <DetailPageHeader onBack={() => navigateBack(router, fallbackHref)} title="Kitchen order" className="-mx-6" />
      <View className="flex-1 items-center justify-center">
        <ScreenState icon={<ClipboardList size={24} color="#0E33F3" />} tone="info" title="Missing order ID" description="This order link is incomplete." actionLabel="Go back" onAction={() => navigateBack(router, fallbackHref)} />
      </View>
    </CustomSafeAreaView>
  );
}

type ErrorStateProps = DetailStateProps & {
  refetch: () => void;
  isRefetching: boolean;
};

function ErrorState({ refetch, isRefetching, router, fallbackHref }: ErrorStateProps) {
  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
      <DetailPageHeader onBack={() => navigateBack(router, fallbackHref)} title="Kitchen order" className="-mx-6" />
      <View className="flex-1 items-center justify-center">
        <ScreenState icon={<AlertTriangle size={24} color="#AB091E" />} tone="danger" title="Could not load this order" description="Check your connection and try again." actionLabel={isRefetching ? "Retrying..." : "Retry"} onAction={() => refetch()} />
        <Button variant="outline" onPress={() => navigateBack(router, fallbackHref)} className="mt-2 w-full">
          <Text className="font-sans-semibold text-base text-primary">Go back</Text>
        </Button>
      </View>
    </CustomSafeAreaView>
  );
}
