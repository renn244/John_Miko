import { Button } from "@/components/ui/Button";
import { useStaffReportsFilterStore } from "@/store/staffReportsFilter.store";
import { ReportSeverity, ReportStatus, ReportType } from "@/types/staffReport.type";
import { RotateCcw, X } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

type FilterOption<T extends string> = {
    label: string;
    value?: T;
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
    const setStatus = useStaffReportsFilterStore((state) => state.setStatus);
    const setType = useStaffReportsFilterStore((state) => state.setType);
    const setSeverity = useStaffReportsFilterStore((state) => state.setSeverity);
    const onReset = useStaffReportsFilterStore((state) => state.reset);

    return (
        <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/35">
                <Pressable className="flex-1" onPress={onClose} />
                <View className="gap-5 rounded-t-3xl border border-neutral-soft-grey-2 bg-white px-5 pb-7 pt-5">
                    <View className="flex-row items-center justify-between">
                        <Text className="font-sans-bold text-xl text-neutral-dark-1">
                            Filter reports
                        </Text>
                        <Pressable
                        onPress={onClose}
                        className="h-9 w-9 items-center justify-center rounded-full bg-neutral-soft-grey-3"
                        >
                            <X size={19} color="#1F2933" />
                        </Pressable>
                    </View>

                    <FilterGroup
                        title="Status"
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                    />
                    <FilterGroup
                        title="Type"
                        options={typeOptions}
                        value={type}
                        onChange={setType}
                    />
                    <FilterGroup
                        title="Severity"
                        options={severityOptions}
                        value={severity}
                        onChange={setSeverity}
                    />

                    <View className="flex-row gap-3 border-t border-neutral-soft-grey-2 pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onPress={onReset}
                        >
                            <RotateCcw size={16} color="#1F2933" />
                            <Text className="font-sans-semibold text-base text-neutral-dark-1">
                                Reset
                            </Text>
                        </Button>
                        <Button size="sm" className="flex-1" onPress={onClose}>
                            <Text className="font-sans-semibold text-base text-white">
                                Apply filters
                            </Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
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