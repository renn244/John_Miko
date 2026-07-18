import { Input } from '@/components/ui/input'
import useDebouncedValue from '@/lib/useDebounce'
import { useResortRoleTourTargets } from '@/hooks/roleTours/useResortRoleTourTargets'
import { useStaffReportsBookingFilterStore } from '@/store/staffReportsBooking.store'
import { Search } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'


const BookingListFilter = () => {
    const { dashboardHeaderTargetProps, bookingSearchTargetProps } = useResortRoleTourTargets();
    const search = useStaffReportsBookingFilterStore((state) => state.search);
    const setSearch = useStaffReportsBookingFilterStore((state) => state.setSearch);
    const [searchInput, setSearchInput] = useState(search || "")
    const debounceSearch = useDebouncedValue(searchInput, 350)

    useEffect(() => {
        setSearch(debounceSearch)
    }, [debounceSearch, setSearch])

    return (
        <View className="gap-4 px-5 pb-3 pt-4">
            <View className="gap-1" {...dashboardHeaderTargetProps}>
                <Text className="font-sans-bold text-2xl text-neutral-dark-1">
                    Upcoming bookings
                </Text>
                <Text className="text-base leading-5 text-neutral-grey-1">
                    Verify guests and prepare for confirmed reservations.
                </Text>
            </View>

            <View className="relative">
                <Input
                    {...bookingSearchTargetProps}
                    value={searchInput}
                    onChangeText={setSearchInput}
                    placeholder="Search guest or ref."
                    surface="white"
                    leftIcon={<Search size={18} color="#9FA8B1" />}
                />
            </View>
      </View>
    )
}

export default BookingListFilter
