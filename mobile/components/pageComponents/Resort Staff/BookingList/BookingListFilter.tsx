import { Input } from '@/components/ui/input'
import StatusChip from '@/components/ui/status-chip'
import useDebouncedValue from '@/lib/useDebounce'
import { useStaffReportsBookingFilterStore } from '@/store/staffReportsBooking.store'
import { Search } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'


type BookingListFilterProps = {
    todayCount: number;
    upcomingCount: number;
}

const BookingListFilter = ({
    todayCount,
    upcomingCount
}: BookingListFilterProps) => {
    const search = useStaffReportsBookingFilterStore((state) => state.search);
    const setSearch = useStaffReportsBookingFilterStore((state) => state.setSearch);
    const [searchInput, setSearchInput] = useState(search || "")
    const debounceSearch = useDebouncedValue(searchInput, 350)

    useEffect(() => {
        setSearch(debounceSearch)
    }, [debounceSearch, setSearch])

    return (
        <View className="gap-4 px-5 pb-3 pt-4">
            <View className="gap-1">
                <Text className="font-sans-bold text-2xl text-neutral-dark-1">
                    Upcoming bookings
                </Text>
                <Text className="text-base leading-5 text-neutral-grey-1">
                    Verify guests and prepare for confirmed reservations.
                </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
                <StatusChip label={`Today ${todayCount}`} tone="pending" size="sm" />
                <StatusChip label={`Upcoming ${upcomingCount}`} tone="primary" size="sm" />
                <StatusChip label="Confirmed" tone="confirmed" size="sm" />
            </View>

            <View className="relative">
                <Input
                    size="sm"
                    value={searchInput}
                    onChangeText={setSearchInput}
                    placeholder="Search guest, contact, or booking ID"
                    surface="white"
                    leftIcon={<Search size={18} color="#9FA8B1" />}
                />
            </View>
      </View>
    )
}

export default BookingListFilter
