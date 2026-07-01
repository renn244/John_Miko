import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useKitchenPreOrdersFilterStore } from "@/store/kitchenPreOrdersFilter.store";
import { addDays, format } from "date-fns";
import { CalendarDays, Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export default function PreOrderFilters() {
  const search = useKitchenPreOrdersFilterStore((s) => s.search);
  const date = useKitchenPreOrdersFilterStore((s) => s.date);
  const setSearch = useKitchenPreOrdersFilterStore((s) => s.setSearch);
  const setDate = useKitchenPreOrdersFilterStore((s) => s.setDate);
  const [dateOpen, setDateOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(date);

  const dateInvalid = useMemo(
    () => draftDate.trim().length > 0 && !isDateOnly(draftDate.trim()),
    [draftDate]
  );

  const openDateSheet = () => {
    setDraftDate(date);
    setDateOpen(true);
  };

  const applyDate = () => {
    if (dateInvalid) return;
    setDate(draftDate.trim());
    setDateOpen(false);
  };

  const setQuickDate = (offsetDays: number) => {
    setDraftDate(format(addDays(new Date(), offsetDays), "yyyy-MM-dd"));
  };

  return (
    <>
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <Input
            size="sm"
            surface="white"
            placeholder="Search guest or booking ID"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            leftIcon={<Search size={18} color="#9FA8B1" />}
          />
        </View>
        <Pressable
          onPress={openDateSheet}
          className={`h-10 w-10 items-center justify-center rounded-sm border ${
            date ? "border-primary bg-primary/10" : "border-neutral-soft-grey-1 bg-white"
          }`}
        >
          <CalendarDays size={18} color={date ? "#0E33F3" : "#4D5963"} />
        </Pressable>
      </View>

      {date ? (
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-neutral-grey-1">
            Showing orders for {date}
          </Text>
          <Pressable onPress={() => setDate("")}>
            <Text className="font-sans-semibold text-sm text-primary">
              Clear
            </Text>
          </Pressable>
        </View>
      ) : null}

      <Modal
        visible={dateOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setDateOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/35">
          <Pressable className="flex-1" onPress={() => setDateOpen(false)} />
          <View className="gap-5 rounded-t-3xl border border-neutral-soft-grey-2 bg-white px-5 pb-7 pt-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-sans-bold text-xl text-neutral-dark-1">
                Filter by date
              </Text>
              <Pressable
                onPress={() => setDateOpen(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-neutral-soft-grey-3"
              >
                <X size={19} color="#1F2933" />
              </Pressable>
            </View>

            <View className="gap-3">
              <Text className="text-sm uppercase tracking-wide text-neutral-grey-1">
                Quick select
              </Text>
              <View className="flex-row gap-2">
                <QuickDateButton
                  label="Today"
                  selected={draftDate === format(new Date(), "yyyy-MM-dd")}
                  onPress={() => setQuickDate(0)}
                />
                <QuickDateButton
                  label="Tomorrow"
                  selected={draftDate === format(addDays(new Date(), 1), "yyyy-MM-dd")}
                  onPress={() => setQuickDate(1)}
                />
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm uppercase tracking-wide text-neutral-grey-1">
                Date
              </Text>
              <Input
                size="sm"
                surface="white"
                placeholder="YYYY-MM-DD"
                value={draftDate}
                onChangeText={setDraftDate}
                autoCapitalize="none"
                autoCorrect={false}
                invalid={dateInvalid}
                leftIcon={<CalendarDays size={18} color="#9FA8B1" />}
              />
              <Text className={dateInvalid ? "text-sm text-system-red" : "text-sm text-neutral-grey-1"}>
                {dateInvalid ? "Use YYYY-MM-DD" : "Leave blank to show all dates."}
              </Text>
            </View>

            <View className="flex-row gap-3 border-t border-neutral-soft-grey-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onPress={() => {
                  setDraftDate("");
                  setDate("");
                  setDateOpen(false);
                }}
              >
                <Text className="font-sans-semibold text-base text-neutral-dark-1">
                  Clear date
                </Text>
              </Button>
              <Button
                size="sm"
                className="flex-1"
                disabled={dateInvalid}
                onPress={applyDate}
              >
                <Text className="font-sans-semibold text-base text-white">
                  Apply
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function QuickDateButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-10 flex-1 items-center justify-center rounded-sm border ${
        selected ? "border-primary bg-primary" : "border-neutral-soft-grey-1 bg-white"
      }`}
    >
      <Text
        className={`font-sans-semibold text-base ${
          selected ? "text-white" : "text-neutral-dark-2"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
