import {
  Calendar,
  CalendarTheme,
  toDateId,
  useCalendar
} from "@marceloterreiro/flash-calendar";
import { format } from "date-fns/fp";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

const today = toDateId(new Date());

export type DatePickerProps = {
  value?: string;
  onChange?: (date: Date) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? toDateId(new Date(value)) : today);

  const { 
    weekDaysList, 
    calendarRowMonth,
    weeksList,
  } = useCalendar({
    calendarMonthId: today,
    calendarActiveDateRanges: [{ startId: today, endId: today }],
    calendarFirstDayOfWeek: 'monday',
    getCalendarWeekDayFormat: format('EEEEEE')
  })

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <View className="h-12 px-4 bg-[#F5F6F7] justify-center rounded-xl">
          <Text className={value ? "text-neutral-900 text-lg" : "text-neutral-400 text-lg"}>
            {value ? selectedDate : placeholder}
          </Text>
        </View>
      </Pressable>

      <Modal transparent visible={open} animationType="fade">
        <Pressable
        className="flex-1 bg-black/30"
        onPress={() => setOpen(false)}
        />

        <View className="absolute bottom-[30%] w-full p-4">
          <View className="bg-white rounded-3xl p-4 shadow-lg">
            <Calendar.VStack>
              <Calendar.HStack justifyContent="space-between">
                <Pressable className="p-1 border border-neutral-grey-3 rounded-[10px]">
                  <ChevronLeft  width={24} height={24} />
                </Pressable>

                <Text className="sub-heading-sm leading-5 text-neutral-dark-2">
                  {calendarRowMonth} - 2026
                </Text>

                <Pressable className="p-1 border border-neutral-grey-3 rounded-[10px]">
                  <ChevronRight width={24} height={24} />
                </Pressable>
              </Calendar.HStack>

              <Calendar.Row.Week>
                {weekDaysList.map((day) => (
                    <Calendar.Item.WeekName
                    key={day}
                    height={40}
                    theme={calendarTheme.itemWeekName}
                    >
                      {day}
                    </Calendar.Item.WeekName>
                ))}
              </Calendar.Row.Week>

              {weeksList.map((week, weekIndex) => (
                <Calendar.Row.Week key={weekIndex}>
                  {week.map((day) => (
                    <Calendar.Item.Day.Container
                    dayHeight={40}
                    daySpacing={4}
                    metadata={day}
                    isStartOfWeek={day.isStartOfWeek}
                    theme={calendarTheme.itemDayContainer}
                    >
                      <Calendar.Item.Day
                      height={20}
                      metadata={day}
                      onPress={() => undefined}
                      theme={calendarTheme.itemDay}
                      >
                        {day.displayLabel}
                      </Calendar.Item.Day>
                    </Calendar.Item.Day.Container>
                  ))}
                </Calendar.Row.Week>
              ))}
            </Calendar.VStack>
          </View>
        </View>
      </Modal>
    </>
  );
}

const calendarTheme: CalendarTheme = {
  rowMonth: {
    content: {
      textAlign: "left",
      color: "#333",
      fontWeight: "700",
    },
  },
  rowWeek: {
    container: {
      borderBottomWidth: 2,
      borderBottomColor: "#888",
    },
  },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: "#8b0000",
    },
  },
  itemDay: {
    base: ({ isDifferentMonth, isPressed }) => ({
      container: {
        padding: 10,
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
        backgroundColor: isPressed ? '#E6E8EB' : '#FFFFFF',
      },
      content: {
        fontSize: 14,
        lineHeight: 20,
        alignSelf: "center",
        color: isDifferentMonth ? '#B0B8BF' : '#242D35',
      }
    }),
    today: () => ({
      container: {
        borderWidth: 0,
      }
    }),
    active: () => ({
      container: {
        backgroundColor: "#0E33F3",
        borderWidth: 0,
        borderBottomEndRadius: 8,
        borderBottomStartRadius: 8,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      },
      content: {
        color: '#FFFFFF'
      }
    }),
  },
  itemWeekName: {
    container: {
      padding: 12,
    },
    content: {
      fontWeight: "600",
      fontSize: 12,
      lineHeight: 16,
      color: '#242D35',
    }
  }
}

export default DatePicker;