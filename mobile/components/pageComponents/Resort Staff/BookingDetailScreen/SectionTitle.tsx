import { Text } from "react-native";

type SectionTitleProps = {
  title: string;
};

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <Text className="font-sans-semibold text-base text-neutral-dark-1">
      {title}
    </Text>
  );
}
