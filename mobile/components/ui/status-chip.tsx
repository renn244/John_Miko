import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const statusChipVariants = tv({
  base: "self-start flex-row items-center rounded-full border",
  variants: {
    tone: {
      neutral: "border-neutral-soft-grey-2 bg-white",
      primary: "border-primary/20 bg-primary/10",
      info: "border-secondary-blue-light bg-secondary-blue-light",
      confirmed: "border-secondary-green-light bg-secondary-green-light",
      completed: "border-secondary-green-light bg-secondary-green-light",
      approved: "border-secondary-green-light bg-secondary-green-light",
      pending: "border-secondary-yellow-light bg-secondary-yellow-light",
      medium: "border-secondary-yellow-light bg-secondary-yellow-light",
      maintenance: "border-secondary-soft-orange bg-secondary-soft-orange",
      warning: "border-secondary-soft-orange bg-secondary-soft-orange",
      high: "border-system-red/20 bg-system-red/10",
      rejected: "border-system-red/20 bg-system-red/10",
      danger: "border-system-red/20 bg-system-red/10",
      low: "border-secondary-blue-light bg-secondary-blue-light",
      inProgress: "border-secondary-blue-light bg-secondary-blue-light",
    },
    size: {
      sm: "gap-1 px-2 py-0.5",
      md: "gap-1.5 px-3 py-1",
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: "md",
  },
});

const statusChipTextClassName = {
  neutral: "text-neutral-dark-2",
  primary: "text-primary",
  info: "text-primary-dark",
  confirmed: "text-secondary-green-dark",
  completed: "text-secondary-green-dark",
  approved: "text-secondary-green-dark",
  pending: "text-neutral-dark-1",
  medium: "text-secondary-brown",
  maintenance: "text-secondary-dark-blue",
  warning: "text-secondary-dark-blue",
  high: "text-secondary-red-dark",
  rejected: "text-secondary-red-dark",
  danger: "text-secondary-red-dark",
  low: "text-primary-dark",
  inProgress: "text-primary",
} as const;

export type StatusChipTone = keyof typeof statusChipTextClassName;

type StatusChipProps = {
  label: string;
  tone?: StatusChipTone;
  size?: "sm" | "md";
  icon?: ReactNode;
  uppercase?: boolean;
  className?: string;
  textClassName?: string;
};

export default function StatusChip({
  label,
  tone = "neutral",
  size = "md",
  icon,
  uppercase,
  className,
  textClassName,
}: StatusChipProps) {
  return (
    <View className={twMerge(statusChipVariants({ tone, size }), className)}>
      {icon}
      <Text
        className={twMerge(
          "font-sans-semibold",
          size === "sm" ? "text-sm" : "text-base",
          uppercase ? "uppercase tracking-wide" : "",
          statusChipTextClassName[tone],
          textClassName
        )}
      >
        {label}
      </Text>
    </View>
  );
}

export { statusChipVariants };
