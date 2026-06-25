import OperationalCard from '@/components/ui/operational-card'
import SectionTitle from '@/components/ui/section-title'
import { getBookingStayDates } from '@/lib/bookingStay'
import { KitchenOrder } from '@/types/kitchenOrder.type'
import { format } from 'date-fns/format'
import { CalendarDays } from 'lucide-react-native'
import React, { useMemo } from 'react'
import { Text, View } from 'react-native'

type BookingTimelineProps = {
    order: KitchenOrder
}
    
const BookingTimeline = ({
    order
}: BookingTimelineProps) => {
    const checkInOut = useMemo(() => {
        const checkInRaw = order?.bookingDate;

        if (!checkInRaw) {
          return { checkIn: "-", checkOut: "-" };
        }
    
        const hasScheduleTimes = Boolean(order?.startTime && order?.endTime);
        const { checkIn, checkOut } = getBookingStayDates({
          bookingDate: checkInRaw,
          startTime: order?.startTime,
          endTime: order?.endTime,
        });
    
        const formatTimelineDate = (date: Date) =>format(date, hasScheduleTimes ? "MMM dd, yyyy - h:mm a" : "MMM dd, yyyy");
    
        return {
          checkIn: formatTimelineDate(checkIn),
          checkOut: hasScheduleTimes ? formatTimelineDate(checkOut) : "Time not set",
        };
    }, [order?.bookingDate, order?.endTime, order?.startTime]);

    return (
        <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-3 px-4 py-4">
            <SectionTitle title="Reservation timeline" />
            <View>
                <TimelineItem active label="Check-in" dateTime={checkInOut.checkIn} />
                <TimelineItem label="Check-out" dateTime={checkInOut.checkOut} isLast />
            </View>
        </OperationalCard>
    )
}

function TimelineItem({
    active,
    label,
    dateTime,
    isLast,
}: {
    active?: boolean;
    label: string;
    dateTime: string;
    isLast?: boolean;
}) {
    return (
        <View className="flex-row gap-3">
            <View className="items-center">
                <View
                    className={`h-4 w-4 rounded-full ${
                        active ? "border-4 border-primary" : "border-2 border-neutral-soft-grey-1"
                    }`}
                />
                {!isLast ? <View className="h-10 w-px bg-neutral-soft-grey-1" /> : null}
            </View>
            <View className="flex-1 pb-4">
                <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
                    {label}
                </Text>
                <View className="mt-1 flex-row items-center gap-2">
                    <CalendarDays size={14} color="#111827" />
                    <Text className="font-sans-semibold text-base text-neutral-dark-1">
                        {dateTime}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default BookingTimeline
