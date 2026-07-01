import { Image } from "expo-image";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";

const WORDMARK_SOURCE = require("@/assets/app/logo/JMPort_With_MarkDown.png");

type BrandWordmarkProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeStyles = {
  sm: {
    width: 112,
    height: 32,
  },
  md: {
    width: 126,
    height: 36,
  },
  lg: {
    width: 148,
    height: 42,
  },
} as const;

export default function BrandWordmark({
  size = "md",
  className,
}: BrandWordmarkProps) {
  const dimensions = sizeStyles[size];

  return (
    <View
      className={twMerge("justify-center", className)}
      accessible
      accessibilityRole="image"
      accessibilityLabel="JMPort"
    >
      <Image
        source={WORDMARK_SOURCE}
        contentFit="contain"
        style={dimensions}
      />
    </View>
  );
}
