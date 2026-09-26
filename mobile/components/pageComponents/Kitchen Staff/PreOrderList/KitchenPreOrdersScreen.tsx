import PreOrderFilters from "@/components/pageComponents/Kitchen Staff/PreOrderList/PreOrderFilters";
import PreOrderList from "@/components/pageComponents/Kitchen Staff/PreOrderList/PreOrderList";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useKitchenRoleTourTargets } from "@/hooks/roleTours/useKitchenRoleTourTargets";
import type { KitchenOrderScope } from "@/types/kitchenOrder.type";
import { Text, View } from "react-native";

type KitchenPreOrdersScreenProps = {
  scope: KitchenOrderScope;
};

const screenCopy: Record<KitchenOrderScope, { title: string; description: string }> = {
  active: {
    title: "Kitchen queue",
    description: "Guest meal pre-orders ready for preparation.",
  },
  history: {
    title: "Kitchen history",
    description: "Past guest meal pre-orders and preparation records.",
  },
};

export default function KitchenPreOrdersScreen({ scope }: KitchenPreOrdersScreenProps) {
  const { dashboardHeaderTargetProps } = useKitchenRoleTourTargets();
  const { title, description } = screenCopy[scope];

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View
        className="gap-4 border-b border-neutral-soft-grey-2 px-5 pb-4 pt-4"
        {...dashboardHeaderTargetProps}
      >
        <View>
          <Text className="font-sans-bold text-3xl text-neutral-dark-1">{title}</Text>
          <Text className="mt-1 text-base text-neutral-grey-1">{description}</Text>
        </View>

        <PreOrderFilters />
      </View>

      <PreOrderList scope={scope} />
    </CustomSafeAreaView>
  );
}
