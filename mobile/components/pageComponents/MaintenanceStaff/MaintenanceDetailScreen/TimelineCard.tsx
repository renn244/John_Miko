import OperationalCard from '@/components/ui/operational-card';
import type { AssignedMaintenanceDetail } from '@/types/maintenance.type';
import { format } from 'date-fns';
import { Text, View } from 'react-native';

type TimelineRowState = "done" | "muted";

type TimelineRow = {
  label: string;
  value: string;
  state: TimelineRowState;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return 'Not set yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set yet';
  return format(date, 'MMM dd, h:mm a');
};

const getTimelineRows = (maintenance: AssignedMaintenanceDetail): TimelineRow[] => [
  {
    label: 'Ticket Created',
    value: formatDateTime(maintenance.createdAt),
    state: 'done',
  },
  {
    label: 'Work Started',
    value: maintenance.startedAt ? formatDateTime(maintenance.startedAt) : 'Not started yet',
    state: maintenance.startedAt ? 'done' : 'muted',
  },
  {
    label: 'Resolved',
    value: maintenance.resolvedAt ? formatDateTime(maintenance.resolvedAt) : 'Not resolved yet',
    state: maintenance.resolvedAt ? 'done' : 'muted',
  },
  {
    label: 'Closed',
    value: maintenance.closedAt ? formatDateTime(maintenance.closedAt) : 'Not closed yet',
    state: maintenance.closedAt ? 'done' : 'muted',
  },
];

type TimelineCardProps = {
  maintenance: AssignedMaintenanceDetail;
};

export function TimelineCard({ maintenance }: TimelineCardProps) {
  const rows = getTimelineRows(maintenance);

  return (
    <OperationalCard contentClassName="gap-4 px-4 py-4">
      <Text className="font-sans-bold text-lg text-neutral-dark-1">Timeline</Text>
      <View>
        {rows.map((row, index) => (
          <View key={row.label} className="flex-row items-baseline gap-3">
            <View className="items-center">
              <View
                className={`-mt-1 h-2.5 w-2.5 rounded-full ${
                  row.state === 'done' ? 'bg-primary' : 'bg-neutral-soft-grey-1'
                }`}
              />
              {index < rows.length - 1 ? (
                <View className="h-8 w-px bg-neutral-soft-grey-1" />
              ) : null}
            </View>
            <Text
              className={`flex-1 font-sans-semibold text-base ${
                row.state === 'muted' ? 'text-neutral-grey-1' : 'text-neutral-dark-1'
              }`}
            >
              {row.label}
            </Text>
            <Text
              className={`text-right font-sans-semibold text-base ${
                row.state === 'muted' ? 'text-neutral-grey-1' : 'text-neutral-dark-2'
              }`}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </OperationalCard>
  );
}
