import { Calendar, CalendarTheme, toDateId, useCalendar } from '@marceloterreiro/flash-calendar';
import { format } from 'date-fns/fp';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const PocketDatePicker = () => {

    const today = toDateId(new Date());
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
        <View className="bg-white rounded-3xl p-4">
            <Calendar.VStack>
                <Calendar.HStack justifyContent='space-between'>
                    <Pressable className='p-1 border border-neutral-grey-3 rounded-[10px]'>
                        <ChevronLeft width={24} height={24} />
                    </Pressable>

                    <Text className='sub-heading-sm leading-5 text-neutral-dark-2'>
                        {calendarRowMonth}
                    </Text>

                    <Pressable className='p-1 border border-neutral-grey-3 rounded-[10px]'>
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

                {weeksList.map((week, weekIndex) => {
                    if(!week.some(day => day.isToday)) {
                        return null;
                    }

                    return (
                        <Calendar.Row.Week key={weekIndex}>
                            {week.map((day) => (
                                <Calendar.Item.Day.Container
                                key={day.id}
                                dayHeight={40}
                                daySpacing={4}
                                metadata={day}
                                isStartOfWeek={day.isStartOfWeek}
                                theme={calendarTheme.itemDayContainer}
                                >
                                    <Calendar.Item.Day
                                    height={24}
                                    metadata={day}
                                    onPress={() => undefined}
                                    theme={calendarTheme.itemDay}
                                    >
                                        {day.displayLabel}
                                    </Calendar.Item.Day>
                                </Calendar.Item.Day.Container>
                            ))}
                        </Calendar.Row.Week>
                    )
                })}
            </Calendar.VStack>
        </View>
    )
}

export default PocketDatePicker

const calendarTheme: CalendarTheme = {
    itemDayContainer: {
        activeDayFiller: {
            backgroundColor: "#8b0000"
        }
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
                lineHeight: 24,
                alignSelf: "center",
                color: isDifferentMonth ? '#888' : '#333',
            }
        }),
        today: () => ({
            container: {
                backgroundColor: "#0E33F3",
                borderWidth: 0,
                borderBottomEndRadius: 8,
                borderBottomStartRadius: 8,
                borderTopEndRadius: 8,
                borderTopStartRadius: 8,
            },
            content: {
                color: "#FFFFFF"
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
                color: "#FFFFFF"
            }
        })
    },
    itemWeekName: {
        container: {
            padding: 12,
        },
        content: {
            fontWeight: '600',
            fontSize: 12,
            lineHeight: 16,
            color: '#242D35'
        }
    }
}