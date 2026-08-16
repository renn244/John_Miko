import { Input } from "@/components/ui/input";
import StatusChip from "@/components/ui/status-chip";
import { useMaintenanceRoleTourTargets } from "@/hooks/roleTours/useMaintenanceRoleTourTargets";
import type { AssignedMaintenanceSummary } from "@/types/maintenance.type";
import { Search } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

type MaintenanceListHeaderProps = {
  scope: "active" | "history";
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  summary?: AssignedMaintenanceSummary;
  isSummaryLoading?: boolean;
};

const MaintenanceListHeader = ({
  scope,
  title,
  description,
  searchValue,
  onSearchChange,
  summary,
  isSummaryLoading = false,
}: MaintenanceListHeaderProps) => {
  const {
    dashboardHeaderTargetProps,
    ticketSearchTargetProps,
    historyHeaderTargetProps,
    historyTicketSearchTargetProps,
  } = useMaintenanceRoleTourTargets();
  const headerTargetProps =
    scope === "active" ? dashboardHeaderTargetProps : historyHeaderTargetProps;
  const searchTargetProps =
    scope === "active"
      ? ticketSearchTargetProps
      : historyTicketSearchTargetProps;

  const hasActiveTickets = Boolean(
    summary && summary.pending + summary.inProgress > 0,
  );

  return (
    <View className="gap-4 px-5 pb-3 pt-4">
      <View {...headerTargetProps}>
        <Text className="font-sans-bold text-3xl text-neutral-dark-1">
          {title}
        </Text>
        <Text className="mt-2 text-lg leading-6 text-neutral-grey-1">
          {description}
        </Text>
      </View>

      <Input
        {...searchTargetProps}
        leftIcon={<Search size={18} color="#9FA8B1" />}
        surface="white"
        placeholder="Search ticket or title"
        value={searchValue}
        onChangeText={onSearchChange}
      />

      {scope === "active" && hasActiveTickets && !isSummaryLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 20 }}
        >
          <StatusChip
            label={`Pending ${summary?.pending ?? 0}`}
            tone="pending"
            size="sm"
          />
          <StatusChip
            label={`In Progress ${summary?.inProgress ?? 0}`}
            tone="inProgress"
            size="sm"
          />
          <StatusChip
            label={`High Priority ${summary?.highPriority ?? 0}`}
            tone="high"
            size="sm"
          />
        </ScrollView>
      ) : null}
    </View>
  );
};

export default MaintenanceListHeader;
