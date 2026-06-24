import { Input } from '@/components/ui/input'
import { StatusChipTone } from '@/components/ui/status-chip'
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
    }, [debouncedSearch]);

    return (
        <View className="gap-4 px-5 pb-3 pt-4">
            <View>
                <Text className="font-sans-bold text-3xl text-neutral-dark-1">{title}</Text>
                <Text className="mt-2 text-lg leading-6 text-neutral-grey-1">{description}</Text>
            </View>

            <Input
                leftIcon={<Search size={20} color="#6B7280" />}
                surface="white"
                className="text-base"
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
                    <SummaryPill
                        label="Pending"
                        value={summary.pending}
                        tone="info"
                    />
                    <SummaryPill
                        label="In Progress"
                        value={summary.inProgress}
                        tone="info"
                    />
                    <SummaryPill
                        label="High Priority"
                        value={summary.high}
                        tone="high"
                    />
                </ScrollView>
            ) : null}
        </View>
    )
}

const SummaryPill = ({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: StatusChipTone;
}) => {
    return (
        <View
        className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
            tone === "high"
                ? "border-system-red/20 bg-system-red/10"
                : "border-secondary-blue-light bg-secondary-blue-light"
        }`}
        >
            <Text
                className={`font-sans-semibold text-base ${
                    tone === "high" ? "text-secondary-red-dark" : "text-neutral-dark-1"
                }`}
            >
                {label}
            </Text>
            <Text
                className={`font-sans-semibold text-base ${
                    tone === "high" ? "text-secondary-red-dark" : "text-neutral-dark-1"
                }`}
            >
                {value}
            </Text>
        </View>
    );
}

export default MaintenanceListHeader