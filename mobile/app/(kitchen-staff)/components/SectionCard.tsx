import { Text, View, type ReactNode } from "react-native";
import { twMerge } from "tailwind-merge";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <View className={twMerge("rounded-3xl bg-white px-5 py-4 shadow-sm", className)}>
      <Text className="font-sans-semibold text-lg text-neutral-dark-1">
        {title}
      </Text>
      <View className="mt-3 gap-3">
        {children}
      </View>
    </View>
  );
}
