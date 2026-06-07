import PreOrderFilters from "@/components/pageComponents/Kitchen Staff/PreOrderFilters";
import { Text, View } from "react-native";

type PreOrdersHeaderProps = {
  totalCount?: number;
};

export default function PreOrdersHeader({ totalCount }: PreOrdersHeaderProps) {
  return (
    <View className="pt-4 pb-3 gap-3">
      <View className="gap-1">
        <Text className="font-sans-bold text-2xl text-neutral-dark-1">
          Pre-orders
        </Text>
        <Text className="text-base text-neutral-grey-1">
          Reservations with meals to prepare
        </Text>
        {typeof totalCount === "number" ? (
          <Text className="text-base text-neutral-grey-1 mt-1">
            {totalCount} order{totalCount === 1 ? "" : "s"}
          </Text>
        ) : null}
      </View>

      <PreOrderFilters />
    </View>
  );
}
