import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { AppBottomSheet } from "@/components/ui/bottom-sheet";
import { useKitchenPreOrdersFilterStore } from "@/store/kitchenPreOrdersFilter.store";
import { useKitchenRoleTourTargets } from "@/hooks/roleTours/useKitchenRoleTourTargets";
import { buildCalendar } from "@marceloterreiro/flash-calendar";
import type { KitchenOrderStatus } from "@/types/kitchenOrder.type";
import { addMonths, format, parseISO, startOfMonth, subMonths } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

const getCalendarMonth = (dateId: string) => {
  if (!dateId) return startOfMonth(new Date());

  const parsed = parseISO(dateId);
  return Number.isNaN(parsed.getTime()) ? startOfMonth(new Date()) : startOfMonth(parsed);
};

export default function PreOrderFilters() {
  const { preOrderSearchTargetProps, dateFilterTargetProps } = useKitchenRoleTourTargets();
  const search = useKitchenPreOrdersFilterStore((s) => s.search);
  const date = useKitchenPreOrdersFilterStore((s) => s.date);
  const status = useKitchenPreOrdersFilterStore((s) => s.status);
  const setSearch = useKitchenPreOrdersFilterStore((s) => s.setSearch);
  const setDate = useKitchenPreOrdersFilterStore((s) => s.setDate);
  const setStatus = useKitchenPreOrdersFilterStore((s) => s.setStatus);
  const [dateOpen, setDateOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<string | undefined>();
  const [calendarMonth, setCalendarMonth] = useState(() => getCalendarMonth(date));

  const openDateSheet = () => {
    setDraftDate(date || undefined);
    setCalendarMonth(getCalendarMonth(date));
    setDateOpen(true);
  };

  return (
    <>
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <Input
            {...preOrderSearchTargetProps}
            surface="white"
            placeholder="Search guest or ref."
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            leftIcon={<Search size={18} color="#9FA8B1" />}
          />
        </View>
        <Pressable
          {...dateFilterTargetProps}
          accessibilityRole="button"
          accessibilityLabel="Filter pre-orders by date"
          hitSlop={4}
          onPress={openDateSheet}
          className={`h-10 w-10 items-center justify-center rounded-sm border ${
            date ? "border-primary bg-primary/10" : "border-neutral-soft-grey-1 bg-white"
          }`}
        >
          <CalendarDays size={18} color={date ? "#0E33F3" : "#4D5963"} />
        </Pressable>
      </View>

      <View className="flex-row gap-2">
        {(
          [
            { label: "All", value: undefined },
            { label: "Pending", value: "Pending" },
            { label: "Completed", value: "Completed" },
          ] as const
        ).map((option) => {
          const selected = status === option.value;

          return (
            <Pressable
              key={option.label}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`h-9 flex-1 items-center justify-center rounded-full border px-3 ${
                selected
                  ? "border-primary bg-primary"
                  : "border-neutral-soft-grey-1 bg-white"
              }`}
              onPress={() => setStatus(option.value as KitchenOrderStatus | undefined)}
            >
              <Text
                className={`font-sans-semibold text-sm ${
                  selected ? "text-white" : "text-neutral-dark-2"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
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

      <AppBottomSheet
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        title="Filter by date"
      >
        <View className="gap-5">
          <DateCalendar
            calendarMonth={calendarMonth}
            onMonthChange={setCalendarMonth}
            onSelectDate={setDraftDate}
            selectedDate={draftDate}
          />

          <View className="flex-row gap-3 border-t border-neutral-soft-grey-2 pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onPress={() => {
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
              disabled={!draftDate}
              onPress={() => {
                if (!draftDate) return;
                setDate(draftDate);
                setDateOpen(false);
              }}
            >
              <Text className="font-sans-semibold text-base text-white">
                Apply
              </Text>
            </Button>
          </View>
        </View>
      </AppBottomSheet>
    </>
  );
}

function DateCalendar({
  calendarMonth,
  onMonthChange,
  onSelectDate,
  selectedDate,
}: {
  calendarMonth: Date;
  onMonthChange: (month: Date) => void;
  onSelectDate: (dateId: string) => void;
  selectedDate?: string;
}) {
  const { weekDaysList, weeksList } = useMemo(
    () =>
      buildCalendar({
        calendarFirstDayOfWeek: "sunday",
        calendarMonthId: format(calendarMonth, "yyyy-MM-dd"),
      }),
    [calendarMonth],
  );
  const todayId = format(new Date(), "yyyy-MM-dd");

  const handleDayPress = (dateId: string) => {
    onSelectDate(dateId);

    const selectedMonth = getCalendarMonth(dateId);
    if (format(selectedMonth, "yyyy-MM") !== format(calendarMonth, "yyyy-MM")) {
      onMonthChange(selectedMonth);
    }
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          hitSlop={4}
          className="size-9 items-center justify-center rounded-md bg-neutral-soft-grey-3"
          onPress={() => onMonthChange(subMonths(calendarMonth, 1))}
        >
          <ChevronLeft size={18} color="#1F2933" />
        </Pressable>
        <Text className="font-sans-bold text-base text-neutral-dark-1">
          {format(calendarMonth, "MMMM yyyy")}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          hitSlop={4}
          className="size-9 items-center justify-center rounded-md bg-neutral-soft-grey-3"
          onPress={() => onMonthChange(addMonths(calendarMonth, 1))}
        >
          <ChevronRight size={18} color="#1F2933" />
        </Pressable>
      </View>

      <View className="flex-row gap-1">
        {weekDaysList.map((label, index) => (
          <Text key={`${label}-${index}`} className="flex-1 text-center font-sans-medium text-sm text-neutral-grey-1">
            {label}
          </Text>
        ))}
      </View>

      <View className="gap-1">
        {weeksList.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row gap-1">
            {week.map((day) => {
              const selected = day.id === selectedDate;
              const today = day.id === todayId;
              const accessibilityLabel = `${format(
                parseISO(day.id),
                "EEEE, MMMM d, yyyy",
              )}${today ? ", today" : ""}`;

              return (
                <Pressable
                  key={day.id}
                  accessibilityRole="button"
                  accessibilityLabel={accessibilityLabel}
                  accessibilityState={{ selected }}
                  className={`h-10 flex-1 items-center justify-center rounded-md ${
                    selected
                      ? "bg-primary"
                      : today
                        ? "border border-primary bg-primary/5"
                        : ""
                  }`}
                  onPress={() => handleDayPress(day.id)}
                >
                  <Text
                    className={`font-sans-semibold text-base ${
                      selected
                        ? "text-white"
                        : today
                          ? "text-primary"
                          : day.isDifferentMonth
                            ? "text-neutral-grey-1"
                            : "text-neutral-dark-1"
                    }`}
                  >
                    {day.displayLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
