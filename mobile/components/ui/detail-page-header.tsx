import { ArrowLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

type DetailPageHeaderProps = {
  title: string;
  metadata?: string;
  trailing?: ReactNode;
  onBack: () => void;
  className?: string;
};

export default function DetailPageHeader({
  title,
  metadata,
  trailing,
  onBack,
  className,
}: DetailPageHeaderProps) {
  return (
    <View
      className={twMerge(
        "flex-row items-start gap-3 border-b border-neutral-soft-grey-2 bg-neutral-soft-grey-3 px-5 pb-4 pt-3",
        className,
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={4}
        onPress={onBack}
        className="mt-0.5 h-10 w-10 items-center justify-center rounded-full"
      >
        <ArrowLeft size={20} color="#0E33F3" />
      </Pressable>

      <View className="flex-1 gap-0.5 pt-0.5">
        <Text className="font-sans-bold text-lg text-neutral-dark-1">
          {title}
        </Text>
        {metadata ? (
          <Text className="text-sm text-neutral-grey-1">{metadata}</Text>
        ) : null}
      </View>

      {trailing ? <View className="max-w-40 self-center">{trailing}</View> : null}
    </View>
  );
}
