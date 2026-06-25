import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type ReportHeaderProps = {
  onBack: () => void;
  reference: string;
};

export function ReportHeader({ onBack, reference }: ReportHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 border-b border-neutral-soft-grey-2 px-4 pb-3 pt-2">
      <Pressable
        onPress={onBack}
        className="h-9 w-9 items-center justify-center"
      >
        <ArrowLeft size={21} color="#0E33F3" />
      </Pressable>
      <View className="flex-1">
        <Text className="font-sans-bold text-lg text-primary">
          Report details
        </Text>
        <Text className="text-sm text-neutral-grey-1">
          Reference: {reference}
        </Text>
      </View>
    </View>
  );
}
