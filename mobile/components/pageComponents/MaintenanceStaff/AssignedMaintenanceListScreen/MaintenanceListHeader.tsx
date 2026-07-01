import { Input } from '@/components/ui/input'
import StatusChip from '@/components/ui/status-chip'
import useDebouncedValue from '@/lib/useDebounce'
import { useMaintenanceTicketsFilterStore } from '@/store/maintenanceTicketsFilter.store'
import { AssignedMaintenance } from '@/types/maintenance.type'
import { Search } from 'lucide-react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

type MaintenanceListHeaderProps = {
    tickets: AssignedMaintenance[];
    scope: "active" | "history";
    title: string;
    description: string;
}

const MaintenanceListHeader = ({
    tickets,
    scope,
    title,
    description
}: MaintenanceListHeaderProps) =>  {
    const search = useMaintenanceTicketsFilterStore((state) => state.search);
    const setSearch = useMaintenanceTicketsFilterStore((state) => state.setSearch); 

    const [searchInput, setSearchInput] = useState(search || "");
    const debouncedSearch = useDebouncedValue(searchInput, 350);

    const summary = useMemo(() => {
        return {
            pending: tickets.filter((ticket) => ticket.status === "Pending").length,
            inProgress: tickets.filter((ticket) => ticket.status === "InProgress").length,
            high: tickets.filter((ticket) => ticket.priority === "High").length,
        };
    }, [tickets]);

    useEffect(() => {
        setSearch(debouncedSearch);
    }, [debouncedSearch, setSearch]);

    return (
        <View className="gap-4 px-5 pb-3 pt-4">
            <View>
                <Text className="font-sans-bold text-3xl text-neutral-dark-1">{title}</Text>
                <Text className="mt-2 text-lg leading-6 text-neutral-grey-1">{description}</Text>
            </View>

            <Input
                size="sm"
                leftIcon={<Search size={18} color="#9FA8B1" />}
                surface="white"
                placeholder="Search ticket ID or title"
                value={searchInput}
                onChangeText={setSearchInput}
            />

            {scope === "active" && tickets.length > 0 ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, paddingRight: 20 }}
                >
                    <StatusChip
                        label={`Pending ${summary.pending}`}
                        tone="pending"
                        size="sm"
                    />
                    <StatusChip
                        label={`In Progress ${summary.inProgress}`}
                        tone="inProgress"
                        size="sm"
                    />
                    <StatusChip
                        label={`High Priority ${summary.high}`}
                        tone="high"
                        size="sm"
                    />
                </ScrollView>
            ) : null}
        </View>
    )
}

export default MaintenanceListHeader
