import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";

type ScreenStateTone = "neutral" | "info" | "danger" | "success";

type ScreenStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  tone?: ScreenStateTone;
  className?: string;
};

const iconToneClassName = {
  neutral: "bg-neutral-soft-grey-2",
  info: "bg-secondary-blue-light",
  danger: "bg-system-red/10",
  success: "bg-secondary-green-light",
} as const;

export default function ScreenState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  tone = "neutral",
  className,
}: ScreenStateProps) {
  return (
    <View className={twMerge("items-center justify-center gap-4 px-6 py-10", className)}>
      {icon ? (
        <View className={twMerge("h-14 w-14 items-center justify-center rounded-2xl", iconToneClassName[tone])}>
          {icon}
        </View>
      ) : null}

      <View className="items-center gap-1">
        <Text className="text-center font-sans-bold text-xl text-neutral-dark-1">
          {title}
        </Text>
        {description ? (
          <Text className="max-w-64 text-center text-base leading-5 text-neutral-grey-1">
            {description}
          </Text>
        ) : null}
      </View>

      {actionLabel && onAction ? (
        <Button size="sm" onPress={onAction} className="min-w-28">
          <Text className="font-sans-semibold text-base text-white">
            {actionLabel}
          </Text>
        </Button>
      ) : null}
    </View>
  );
}
