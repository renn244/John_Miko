import { Text, View } from "react-native";

type InfoRowProps = {
  label: string;
  value?: string | number | null;
};

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View className="gap-1">
      <Text className="text-base text-neutral-grey-1">{label}</Text>
      <Text className="text-lg text-neutral-dark-1">
        {value === null || typeof value === "undefined" || value === "" ? "—" : String(value)}
      </Text>
    </View>
  );
}
