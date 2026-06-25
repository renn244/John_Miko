import PreOrderFilters from "@/components/pageComponents/Kitchen Staff/PreOrderList/PreOrderFilters";
import PreOrderList from "@/components/pageComponents/Kitchen Staff/PreOrderList/PreOrderList";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import {
  Text,
  View
} from "react-native";

export default function KitchenStaffPreOrdersScreen() {

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

      <PreOrderList />
    </CustomSafeAreaView>
  );
}
