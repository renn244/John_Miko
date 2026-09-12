import PreOrderCard from "@/components/pageComponents/Kitchen Staff/PreOrderList/PreOrderCard";
import ScreenState from "@/components/ui/screen-state";
import { useKitchenOrders } from "@/hooks/kitchenOrders.hook";
import useDebouncedValue from "@/lib/useDebounce";
import { useKitchenPreOrdersFilterStore } from "@/store/kitchenPreOrdersFilter.store";
import {
    AlertTriangle,
    ClipboardList
} from "lucide-react-native";
import { useCallback, useMemo } from "react";
import {
    FlatList,
    RefreshControl,
    Text,
    View,
} from "react-native";

const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const PreOrderList = () => {
    const search = useKitchenPreOrdersFilterStore((s) => s.search);
    const date = useKitchenPreOrdersFilterStore((s) => s.date);
    const status = useKitchenPreOrdersFilterStore((s) => s.status);
    const scope = useKitchenPreOrdersFilterStore((s) => s.scope);

    const debouncedSearch = useDebouncedValue(search.trim(), 350);
    const debouncedDate = useDebouncedValue(date.trim(), 350);

    const dateParam = useMemo(() => {
        const candidate = debouncedDate.trim();
        if (!candidate) return undefined;

        return isDateOnly(candidate) ? candidate : undefined;
    }, [debouncedDate]);

    const {
        data: orders,
        isLoading,
        isRefetching,
        error,
        refetch,
    } = useKitchenOrders({
        scope,
        search: debouncedSearch || undefined,
        date: dateParam,
        status,
    });

    const filteredOrders = useMemo(() => orders ?? [], [orders]);

    const onRefresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return (
        isLoading ? (
            <PreOrderListSkeleton />
        ) : (
            <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.bookingId}
            renderItem={({ item }) => <PreOrderCard item={item} />}
            contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 28,
                paddingTop: 16,
                flexGrow: filteredOrders.length === 0 ? 1 : undefined,
            }}
            refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
                <View className="flex-1 items-center justify-center px-2">
                    <ScreenState
                        tone={error ? "danger" : "info"}
                        icon={
                            error ? (
                                <AlertTriangle size={24} color="#AB091E" />
                            ) : (
                                <ClipboardList size={24} color="#0E33F3" />
                            )
                        }
                        title={error ? "Could not load pre-orders" : "No pre-orders found"}
                        description={
                            error
                                ? "There was a problem connecting to the kitchen display system."
                                : scope === 'active'
                                    ? "Only today's and upcoming service dates appear here. For past orders, switch to History."
                                    : "Past service dates appear here. Try changing the search, date, or status filter."
                        }
                        actionLabel={error ? "Retry" : undefined}
                        onAction={error ? () => refetch() : undefined}
                    />
                </View>
            }
            />
        )
    )
}

const PreOrderListSkeleton = () => {
    return (
        <View className="gap-3 px-5 pt-5">
            <Text className="text-base text-neutral-grey-1">
                Loading pre-orders...
            </Text>
            {[0, 1, 2, 3].map((item) => (
                <View
                key={item}
                className="h-28 rounded-md border border-neutral-soft-grey-2 bg-white"
                >
                    <View className="h-full w-1 bg-secondary-blue-light" />
                </View>
            ))}
        </View>
    )
}

export default PreOrderList;
