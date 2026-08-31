import { Button } from '@/components/ui/Button';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import OperationalCard from '@/components/ui/operational-card';
import StatusChip from '@/components/ui/status-chip';
import { useCompleteAllKitchenItemsMutation, useUpdateKitchenItemStatusMutation } from '@/hooks/kitchenOrders.hook';
import { KitchenOrder, KitchenOrderStatus } from '@/types/kitchenOrder.type';
import { useRouter } from 'expo-router';
import { UtensilsCrossed } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native';

type PreOrderListProps = {
    order: KitchenOrder
}

const itemAccentClassName: Record<KitchenOrderStatus, string> = {
    Pending: "bg-secondary-yellow-light",
    Completed: "bg-secondary-green-light",
};


const PreOrderItemList = ({
    order
}: PreOrderListProps) => {
    const [isLoadingItemId, setIsLoadingItemId] = useState<string | null>(null);
    const [confirmCompleteAllOpen, setConfirmCompleteAllOpen] = useState(false);
    const mutationLockedRef = useRef(false);

    const router = useRouter();
    
    const { mutate: updateItemStatus, isPending: isUpdatingItemStatus } = useUpdateKitchenItemStatusMutation();
    const { mutate: completeAllItems, isPending: isCompletingAllItems } = useCompleteAllKitchenItemsMutation();
    const isMutating = isUpdatingItemStatus || isCompletingAllItems;

    const orderSummary = useMemo(() => {
        const items = order?.items ?? [];
        const completedCount = items.filter((item) => item.status === "Completed").length;
        const pendingCount = items.length - completedCount;
        
        return {
            completedCount,
            pendingCount,
            allCompleted: items.length > 0 && pendingCount === 0,
        };
    }, [order?.items]);

    const handleToggleItemStatus = (
        itemId: string,
        currentStatus: KitchenOrderStatus
    ) => {
        if (!order?.bookingId || isMutating || mutationLockedRef.current) return;

        mutationLockedRef.current = true;
        setIsLoadingItemId(itemId);
        updateItemStatus(
            {
                bookingId: order.bookingId,
                itemId,
                status: currentStatus === "Completed" ? "Pending" : "Completed",
            },
            {
                onSettled: () => {
                    mutationLockedRef.current = false;
                    setIsLoadingItemId((current) => current === itemId ? null : current);
                },
            }
        );
    };

    const handleCompleteAll = () => {
        if (!order?.bookingId || orderSummary.allCompleted || isMutating || mutationLockedRef.current) return;
        setConfirmCompleteAllOpen(true);
    };

    const confirmCompleteAll = () => {
        if (!order?.bookingId || isMutating || mutationLockedRef.current) return;

        mutationLockedRef.current = true;
        setConfirmCompleteAllOpen(false);
        completeAllItems(order.bookingId, {
            onSettled: () => {
                mutationLockedRef.current = false;
            },
        });
    };

    const hasItems = order.items.length > 0;

    return (
        <View className="gap-3">
            <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                    <Text className="font-sans-bold text-xl text-neutral-dark-1">
                        Meal checklist
                    </Text>
                    <Text className="mt-1 text-base text-neutral-grey-1">
                        {orderSummary.completedCount} of {order.items.length} completed
                    </Text>
                </View>

                <StatusChip
                    label={`${orderSummary.pendingCount} pending`}
                    tone={orderSummary.pendingCount > 0 ? "pending" : "completed"}
                    size="sm"
                />
            </View>

            {hasItems ? (
                <Button
                    size="sm"
                    variant="outline"
                    onPress={handleCompleteAll}
                    disabled={
                        isMutating ||
                        orderSummary.allCompleted
                    }
                    className="self-start"
                >
                    <Text className="font-sans-semibold text-base text-neutral-dark-1">
                        Mark all done
                    </Text>
                </Button>
            ) : null}

            {hasItems ? (
                <View className="gap-2">
                    {order.items.map((item) => {
                        const isCompleted = item.status === "Completed";
                        const isLoadingThisItem = isLoadingItemId === item.id;

                        return (
                            <OperationalCard
                                key={item.id}
                                leftAccentClassName={itemAccentClassName[item.status]}
                                contentClassName="gap-0 px-3 py-2.5"
                            >
                                <View className="flex-row items-center gap-3">
                                    <View className="flex-1">
                                        <Text
                                        className={`font-sans-semibold text-lg text-neutral-dark-1 ${
                                            isCompleted ? "line-through text-neutral-grey-1" : ""
                                        }`}
                                        >
                                            {item.name}
                                        </Text>
                                    </View>

                                    <View className="rounded-md bg-secondary-blue-light px-3 py-2">
                                        <Text className="font-sans-bold text-base text-neutral-dark-2">
                                            x{item.quantity}
                                        </Text>
                                    </View>

                                    <Button
                                        size="sm"
                                        variant={isCompleted ? "outline" : "default"}
                                        disabled={isMutating}
                                        onPress={() => handleToggleItemStatus(item.id, item.status)}
                                        className={isCompleted ? "px-4" : "px-5"}
                                    >
                                        {isLoadingThisItem ? (
                                            <LoadingIndicator
                                                tone={isCompleted ? "dark" : "inverse"}
                                            />
                                        ) : (
                                            <Text
                                                className={`font-sans-semibold text-base ${
                                                isCompleted ? "text-neutral-dark-1" : "text-white"
                                                }`}
                                            >
                                                {isCompleted ? "Undo" : "Mark"}
                                            </Text>
                                        )}
                                    </Button>
                                </View>
                            </OperationalCard>
                        );
                    })}
                </View>
            ) : (
                <OperationalCard contentClassName="items-center gap-4 px-4 py-8">
                    <View className="h-14 w-14 items-center justify-center rounded-2xl bg-secondary-blue-light">
                        <UtensilsCrossed size={26} color="#6B7280" />
                    </View>
                    <View className="items-center gap-1">
                        <Text className="text-center font-sans-bold text-xl text-neutral-dark-1">
                            No pre-order items found
                        </Text>
                        <Text className="text-center text-base leading-5 text-neutral-grey-1">
                            This booking has no meal items to prepare.
                        </Text>
                    </View>
                    <Button onPress={() => router.replace("/kitchen-staff")}>
                        <Text className="font-sans-semibold text-base text-white">
                            Return to Dashboard
                        </Text>
                    </Button>
                </OperationalCard>
            )}

            <Modal
                transparent
                animationType="fade"
                visible={confirmCompleteAllOpen}
                statusBarTranslucent
                onRequestClose={() => setConfirmCompleteAllOpen(false)}
            >
                <View className="flex-1 items-center justify-center px-5">
                    <Pressable
                        className="absolute inset-0 bg-black/30"
                        onPress={() => setConfirmCompleteAllOpen(false)}
                    />
                    <View className="w-full max-w-[360px] rounded-3xl bg-white px-6 py-5 shadow-lg">
                        <View className="gap-2">
                            <Text className="font-sans-bold text-xl text-neutral-dark-1">
                                Mark all as done?
                            </Text>
                            <Text className="text-base leading-6 text-neutral-grey-1">
                                This will mark every pre-order item in this booking as completed.
                            </Text>
                        </View>
                        <View className="mt-6 flex-row gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onPress={() => setConfirmCompleteAllOpen(false)}
                            >
                                <Text className="font-sans-semibold text-base text-neutral-dark-1">
                                    Cancel
                                </Text>
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1"
                                disabled={isMutating}
                                onPress={confirmCompleteAll}
                            >
                                <Text className="font-sans-semibold text-base text-white">
                                    Mark all done
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default PreOrderItemList
