import { Text, View } from "react-native";

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="font-sans-bold text-lg text-neutral-dark-1">{title}</Text>
    </View>
  );
}

export default SectionTitle;