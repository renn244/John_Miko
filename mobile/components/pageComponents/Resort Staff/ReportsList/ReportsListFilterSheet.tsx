import { AppBottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/Button";
import { useStaffReportsFilterStore } from "@/store/staffReportsFilter.store";
import { ReportSeverity, ReportStatus, ReportType } from "@/types/staffReport.type";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type FilterOption<T extends string> = {
    label: string;
    value?: T;
};

type ReportFilterDraft = {
  status?: ReportStatus;
  type?: ReportType;
  severity?: ReportSeverity;
};

const statusOptions: FilterOption<ReportStatus>[] = [
    { label: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
];

const typeOptions: FilterOption<ReportType>[] = [
    { label: "All" },
    { label: "Check-in", value: "checkIn" },
    { label: "Check-out", value: "checkOut" },
    { label: "Maintenance", value: "maintenance" },
];

const severityOptions: FilterOption<ReportSeverity>[] = [
    { label: "All" },
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
];

function ReportListFilterSheet({
    visible,
    onClose
}: {
    visible: boolean;
    onClose: () => void;
}) {
    const status = useStaffReportsFilterStore((state) => state.status);
    const type = useStaffReportsFilterStore((state) => state.type);
    const severity = useStaffReportsFilterStore((state) => state.severity);
    const setFilters = useStaffReportsFilterStore((state) => state.setFilters);
    const [draft, setDraft] = useState<ReportFilterDraft>({});

    useEffect(() => {
      if (visible) {
        setDraft({ status, type, severity });
      }
    }, [severity, status, type, visible]);

    const applyFilters = () => {
      setFilters(draft);
      onClose();
    };

    return (
        <AppBottomSheet open={visible} onClose={onClose} title="Filter reports">
            <FilterGroup
                title="Status"
                options={statusOptions}
                value={draft.status}
                onChange={(status) => setDraft((current) => ({ ...current, status }))}
            />
            <FilterGroup
                title="Type"
                options={typeOptions}
                value={draft.type}
                onChange={(type) => setDraft((current) => ({ ...current, type }))}
            />
            <FilterGroup
                title="Severity"
                options={severityOptions}
                value={draft.severity}
                onChange={(severity) => setDraft((current) => ({ ...current, severity }))}
            />

            <View className="flex-row gap-3 border-t border-neutral-soft-grey-2 pt-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onPress={() => setDraft({})}
                >
                    <Text className="font-sans-semibold text-base text-neutral-dark-1">
                        Reset
                    </Text>
                </Button>
                <Button size="sm" className="flex-1" onPress={applyFilters}>
                    <Text className="font-sans-semibold text-base text-white">
                        Apply filters
                    </Text>
                </Button>
            </View>
        </AppBottomSheet>
    );
}

function FilterGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: FilterOption<T>[];
  value?: T;
  onChange: (value?: T) => void;
}) {
  return (
    <View className="gap-3">
      <Text className="font-sans-semibold text-base text-neutral-dark-1">
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value || (!value && !option.value);
          return (
            <Pressable
              key={option.value ?? "all"}
              onPress={() => onChange(option.value)}
              className={`h-10 items-center justify-center rounded-full border px-4 ${
                selected
                  ? "border-primary bg-primary"
                  : "border-neutral-soft-grey-2 bg-white"
              }`}
            >
              <Text
                className={`font-sans-semibold text-base ${
                  selected ? "text-white" : "text-neutral-dark-2"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default ReportListFilterSheet;
