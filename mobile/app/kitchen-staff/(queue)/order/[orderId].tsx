import KitchenOrderDetailsScreen from "@/components/pageComponents/Kitchen Staff/PreOrderDetail/KitchenOrderDetailsScreen";

export default function KitchenQueueOrderDetailsRoute() {
  return <KitchenOrderDetailsScreen fallbackHref="/kitchen-staff/(queue)" />;
}
