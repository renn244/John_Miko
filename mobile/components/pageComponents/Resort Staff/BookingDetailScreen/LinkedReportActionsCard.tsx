import { Button } from "@/components/ui/Button";
import OperationalCard from "@/components/ui/operational-card";
import SectionTitle from "@/components/ui/section-title";
import type { ReportType } from "@/types/staffReport.type";
import { format } from "date-fns";
import { Text, View } from "react-native";

type LinkedReportActionsCardProps = {
  checkIn: Date;
  checkOut: Date;
  reportingOpen: boolean;
  onCreateReport: (type: ReportType) => void;
};

export function LinkedReportActionsCard({
  checkIn,
  checkOut,
  reportingOpen,
  onCreateReport,
}: LinkedReportActionsCardProps) {
  return (
    <OperationalCard contentClassName="gap-2 px-3 py-3">
      <SectionTitle title="Create linked report" />
      <Text className="text-sm leading-4 text-neutral-grey-1">
        Available during guest stay ({format(checkIn, "MMM dd, p")} - {format(checkOut, "MMM dd, p")}).
      </Text>
      {!reportingOpen ? (
        <View className="rounded-md border border-secondary-yellow-light bg-secondary-yellow-light/35 px-3 py-2">
          <Text className="font-sans-semibold text-base text-neutral-dark-1">
            Report window is not open right now.
          </Text>
          <Text className="mt-1 text-sm text-neutral-grey-1">
            Reports can only be created during the active stay.
          </Text>
        </View>
      ) : null}
      <View className="gap-2 pt-1">
        <ReportAction
          disabled={!reportingOpen}
          label="Check-in Report"
          onPress={() => onCreateReport("checkIn")}
        />
        <ReportAction
          disabled={!reportingOpen}
          label="Check-out Report"
          onPress={() => onCreateReport("checkOut")}
        />
        <ReportAction
          disabled={!reportingOpen}
          label="Maintenance Report"
          onPress={() => onCreateReport("maintenance")}
        />
      </View>
    </OperationalCard>
  );
}

function ReportAction({
  disabled,
  label,
  onPress,
}: {
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Button size="sm" disabled={disabled} onPress={onPress} className="rounded-sm">
      <Text className="font-sans-semibold text-base text-white">
        {label}
      </Text>
    </Button>
  );
}
