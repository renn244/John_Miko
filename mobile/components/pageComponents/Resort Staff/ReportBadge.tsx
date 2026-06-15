import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

type ReportBadgeProps = {
  label: string;
  className: string;
};

export default function ReportBadge({ label, className }: ReportBadgeProps) {
  const [backgroundClass, textClass] = className.split(" ");

  return (
    <View className={twMerge("rounded-full px-3 py-1", backgroundClass)}>
      <Text className={twMerge("text-sm font-sans-semibold", textClass)}>
        {label}
      </Text>
    </View>
  );
}
