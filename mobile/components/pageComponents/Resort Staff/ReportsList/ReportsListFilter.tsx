import { Button } from '@/components/ui/Button'
import StatusChip, { StatusChipTone } from '@/components/ui/status-chip'
import { useStaffReportsFilterStore } from '@/store/staffReportsFilter.store'
import { useRouter } from 'expo-router'
import { Filter, Plus, X } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { reportTypeLabels, severityTone } from '../reportDisplay'
import statusMeta from './StatusMeta.constant'

type ReportListFilterProps = {
    setFilterOpen: (open: boolean) => void
}

const ReportsListFilter = ({ setFilterOpen }: ReportListFilterProps) => {
    const setStatus = useStaffReportsFilterStore((state) => state.setStatus)
    const setType = useStaffReportsFilterStore((state) => state.setType)
    const setSeverity = useStaffReportsFilterStore((state) => state.setSeverity)
    const status = useStaffReportsFilterStore((state) => state.status)
    const type = useStaffReportsFilterStore((state) => state.type)
    const severity = useStaffReportsFilterStore((state) => state.severity)

    const router = useRouter()

    const activeFilterCount = [status, type, severity].filter(Boolean).length;

    return (
        <View className="gap-4 border-b border-neutral-soft-grey-2 bg-neutral-soft-grey-3 px-5 pb-4 pt-4">
            <View className="flex-row items-center justify-between gap-4">
                <View className="flex-1">
                <Text className="font-sans-bold text-2xl text-neutral-dark-1">
                    My reports
                </Text>
                <Text className="mt-1 text-base text-neutral-grey-1">
                    Track reports submitted for admin review.
                </Text>
                </View>
                <Button
                    size="icon"
                    className="h-11 w-11 rounded-md"
                    onPress={() => router.push("/resort-staff/new-report")}
                >
                <Plus size={21} color="#FFFFFF" />
                </Button>
            </View>

            <View className="flex-row flex-wrap items-center gap-2">
                <Pressable
                    onPress={() => setFilterOpen(true)}
                    className="h-10 flex-row items-center gap-2 rounded-full border border-neutral-soft-grey-1 bg-white px-4"
                >
                    <Filter size={16} color="#1F2933" />
                    <Text className="font-sans-semibold text-base text-neutral-dark-1">
                        Filter
                    </Text>
                    {activeFilterCount ? (
                        <View className="h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5">
                            <Text className="font-sans-semibold text-sm text-white">
                                {activeFilterCount}
                            </Text>
                        </View>
                    ) : null}
                </Pressable>
                {status ? (
                    <ActiveFilterChip
                        label={status}
                        tone={statusMeta[status].tone}
                        onClear={() => setStatus(undefined)}
                    />
                ) : null}
                {type ? (
                    <ActiveFilterChip
                        label={reportTypeLabels[type]}
                        tone="neutral"
                        onClear={() => setType(undefined)}
                    />
                ) : null}
                {severity ? (
                    <ActiveFilterChip
                        label={`${severity} severity`}
                        tone={severityTone[severity]}
                        onClear={() => setSeverity(undefined)}
                    />  
                ) : null}
            </View>
        </View>
    )
}


function ActiveFilterChip({
    label,
    tone,
    onClear,
}: {
    label: string;
    tone: StatusChipTone;
    onClear: () => void;
}) {
  return (
    <Pressable
      onPress={onClear}
      className="rounded-full"
    >
      <StatusChip
        label={label}
        tone={tone}
        size="sm"
        icon={<X size={11} color="#4D5963" />}
      />
    </Pressable>
  );
}

export default ReportsListFilter
