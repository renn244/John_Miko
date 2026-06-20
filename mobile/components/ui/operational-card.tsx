import type { PropsWithChildren } from "react";
import { Pressable, View, type GestureResponderEvent } from "react-native";
import { twMerge } from "tailwind-merge";

type OperationalCardProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  leftAccentClassName?: string;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}>;

export default function OperationalCard({
  children,
  className,
  contentClassName,
  leftAccentClassName,
  disabled,
  onPress,
}: OperationalCardProps) {
  const cardClassName = twMerge(
    "relative overflow-hidden rounded-lg border border-neutral-soft-grey-2 bg-white shadow-sm",
    className
  );
  const content = (
    <>
      {leftAccentClassName ? (
        <View
          className={twMerge(
            "absolute bottom-0 left-0 top-0 w-1 bg-primary",
            leftAccentClassName
          )}
        />
      ) : null}
      <View className={twMerge("gap-3 px-4 py-3", leftAccentClassName ? "pl-5" : "", contentClassName)}>
        {children}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : disabled ? 0.6 : 1 })}
        className={cardClassName}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={cardClassName}>{content}</View>;
}
