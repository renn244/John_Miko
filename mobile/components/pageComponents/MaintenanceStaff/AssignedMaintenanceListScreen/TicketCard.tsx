import OperationalCard from '@/components/ui/operational-card'
import StatusChip, { StatusChipTone } from '@/components/ui/status-chip'
import { AssignedMaintenance, MaintenancePriority, MaintenanceStatus } from '@/types/maintenance.type'
import { format, isToday, isYesterday } from 'date-fns'
import { useRouter } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

const priorityAccentClassName: Record<MaintenancePriority, string> = {
    Low: "bg-primary",
    Medium: "bg-secondary-yellow-light",
    High: "bg-system-red",
};

const priorityTone: Record<MaintenancePriority, StatusChipTone> = {
    Low: "low",
    Medium: "medium",
    High: "high",
};

const statusTone: Record<MaintenanceStatus, StatusChipTone> = {
    Pending: "pending",
    InProgress: "inProgress",
    Completed: "completed",
    Closed: "neutral",
};

const statusLabel: Record<MaintenanceStatus, string> = {
    Pending: "Pending",
    InProgress: "In Progress",
    Completed: "Completed",
    Closed: "Closed",
};

const formatDateLabel = (value?: string | null) => {
    if (!value) return "No date";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No date";

    if (isToday(date)) return "today";
    if (isYesterday(date)) return "yesterday";
    return format(date, "MMM dd");
};

const formatTime = (value?: string | null) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return format(date, "h:mm a");
};

const formatDateTimeLabel = (value?: string | null) => {
    const dateLabel = formatDateLabel(value);
    const timeLabel = formatTime(value);
    return `${dateLabel}${timeLabel ? `, ${timeLabel}` : ""}`;
};

const getRelevantDate = (ticket: AssignedMaintenance) => {
    switch (ticket.status) {
        case "Pending":
            return ticket.createdAt;
        case "InProgress":
            return ticket.startedAt ?? ticket.createdAt;
        case "Completed":
            return ticket.resolvedAt ?? ticket.updatedAt;
        case "Closed":
            return ticket.closedAt ?? ticket.updatedAt;
    }
};

type TicketCardProps = {
  item: AssignedMaintenance
  detailHref: string;
}

const TicketCard = ({ item, detailHref }: TicketCardProps) => {
    const router = useRouter()

    const relevantDate = getRelevantDate(item);

    return (
        <OperationalCard
            onPress={() => router.push(detailHref as any)}
            leftAccentClassName={priorityAccentClassName[item.priority]}
            contentClassName="gap-3 px-4 py-4"
            className="mx-5 mb-3"
        >
          <View className="flex-row items-start gap-3">
            <View className="flex-1 gap-2">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Text
                        className="flex-1 font-sans-bold text-sm text-neutral-grey-1"
                        numberOfLines={1}
                    >
                      ID: {item.id}
                    </Text>
                    <StatusChip
                      label={item.priority}
                      tone={priorityTone[item.priority]}
                      size="sm"
                      uppercase
                    />
                  </View>

                  <Text className="mt-2 font-sans-bold text-xl text-neutral-dark-1">
                    {item.title}
                  </Text>
                </View>

                <ChevronRight size={22} color="#6B7280" />
              </View>

              <Text className="text-base leading-5 text-neutral-dark-2" numberOfLines={2}>
                {item.description}
              </Text>

              <View className="h-px bg-neutral-soft-grey-2" />

              <View className="flex-row items-center justify-between gap-3">
                <View className="min-w-0 flex-1">
                  <Text
                    className="flex-1 font-sans-semibold text-base text-neutral-grey-1"
                    numberOfLines={1}
                  >
                    {formatDateTimeLabel(relevantDate)}
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <StatusChip
                    label={statusLabel[item.status]}
                    tone={statusTone[item.status]}
                    size="sm"
                  />
                  <StatusChip
                    label={item.expertise}
                    tone="info"
                    size="sm"
                  />
                </View>
              </View>
            </View>
          </View>
        </OperationalCard>
    )
}

export default TicketCard
