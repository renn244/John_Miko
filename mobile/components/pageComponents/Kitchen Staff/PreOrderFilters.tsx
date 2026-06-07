import { Input } from "@/components/ui/input";
import { useKitchenPreOrdersFilterStore } from "@/store/kitchenPreOrdersFilter.store";
import { useMemo } from "react";
import { Text, View } from "react-native";

const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export default function PreOrderFilters() {
  const search = useKitchenPreOrdersFilterStore((s) => s.search);
  const date = useKitchenPreOrdersFilterStore((s) => s.date);
  const setSearch = useKitchenPreOrdersFilterStore((s) => s.setSearch);
  const setDate = useKitchenPreOrdersFilterStore((s) => s.setDate);

  const dateInvalid = useMemo(
    () => date.trim().length > 0 && !isDateOnly(date.trim()),
    [date]
  );

  return (
    <View className="rounded-3xl bg-white px-5 py-4 shadow-sm gap-3">
      <View className="gap-1">
        <Text className="text-base text-neutral-grey-1">Search</Text>
        <Input
          size="sm"
          placeholder="Guest name or booking ID"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      <View className="gap-1">
        <Text className="text-base text-neutral-grey-1">Date</Text>
        <Input
          size="sm"
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          autoCapitalize="none"
          autoCorrect={false}
          invalid={dateInvalid}
        />
        <Text className={dateInvalid ? "text-sm text-system-red" : "text-sm text-neutral-grey-1"}>
          {dateInvalid ? "Use YYYY-MM-DD" : "Leave blank to show all dates"}
        </Text>
      </View>
    </View>
  );
}
