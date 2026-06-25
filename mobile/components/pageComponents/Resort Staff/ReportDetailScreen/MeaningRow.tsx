import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import { Text, View } from "react-native";

type MeaningRowProps = {
  label: string;
  tone: StatusChipTone;
  text: string;
};

export function MeaningRow({ label, tone, text }: MeaningRowProps) {
  return (
    <View className="flex-row items-center gap-2">
      <StatusChip label={label} tone={tone} size="sm" />
      <Text className="flex-1 text-base text-neutral-grey-1">{text}</Text>
    </View>
  );
}
