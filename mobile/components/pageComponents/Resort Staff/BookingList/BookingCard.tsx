import OperationalCard from '@/components/ui/operational-card';
import { CalendarDays, Users } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { StaffBookingSummary } from '@/types/staffBooking.type';
import { useRouter } from '@/.expo/types/router';

const getDateKey = (value: string) => value.slice(0, 10);

const formatBookingDate = (value: string) => {
  const date = parseISO(getDateKey(value));
  return Number.isNaN(date.getTime()) ? value : format(date, "MMM dd, yyyy");
};

type BookingCardProps = {
    item: StaffBookingSummary;
    todayKey: string
}

const BookingCard = ({
    item,
    todayKey
}: BookingCardProps) => {
    const router = useRouter();
    const isToday = getDateKey(item.bookingDate) === todayKey;
    
    return (
        <OperationalCard
          onPress={() =>
            router.push({
              pathname: "/resort-staff/booking/[bookingId]",
              params: { bookingId: item.id },
            })
          }
          className="mb-3"
          leftAccentClassName={isToday ? "bg-secondary-yellow-light" : "bg-primary"}
        >
            <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                    <Text className="font-sans-semibold text-xl text-neutral-dark-1" numberOfLines={1}>
                        {item.guestName}
                    </Text>
                    <Text className="mt-1 text-base text-neutral-grey-1" numberOfLines={1}>
                        {item.accommodation.name} - {item.stayOptionLabelSnapshot}
                    </Text>
                </View>
                <Text className="text-sm font-sans-semibold text-neutral-grey-2">
                    #{item.id.slice(-8).toUpperCase()}
                </Text>
            </View>

            <View className="flex-row flex-wrap gap-x-5 gap-y-2">
                <View className="flex-row items-center gap-2">
                    <CalendarDays size={17} color="#6B7580" />
                    <Text className="text-base text-neutral-grey-1">
                        {formatBookingDate(item.bookingDate)}
                    </Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <Users size={17} color="#6B7580" />
                    <Text className="text-base text-neutral-grey-1">
                        {item.numberOfGuests} guest
                        {item.numberOfGuests === 1 ? "" : "s"}
                    </Text>
                </View>
            </View>

            <Text className="text-sm text-neutral-grey-2" numberOfLines={1}>
                Booking ID: {item.id}
            </Text>
        </OperationalCard>
    )
}

export default BookingCard;