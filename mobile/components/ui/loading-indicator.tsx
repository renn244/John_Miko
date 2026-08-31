import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";

const loadingIndicatorColors = {
  primary: "#0E33F3",
  inverse: "#FFFFFF",
  dark: "#111827",
} as const;

type LoadingIndicatorProps = Omit<ActivityIndicatorProps, "color"> & {
  tone?: keyof typeof loadingIndicatorColors;
};

export function LoadingIndicator({
  tone = "primary",
  accessibilityLabel = "Loading",
  ...props
}: LoadingIndicatorProps) {
  return (
    <ActivityIndicator
      accessibilityLabel={accessibilityLabel}
      color={loadingIndicatorColors[tone]}
      {...props}
    />
  );
}
