import { Text } from "react-native";

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text className="font-sans-semibold text-base text-neutral-dark-1">
      {title}
    </Text>
  );
}

export default SectionTitle;
