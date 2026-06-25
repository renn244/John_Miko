import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type BookingHeaderProps = {
  onBack: () => void;
  reference: string;
};

export function BookingHeader({ onBack, reference }: BookingHeaderProps) {
  return (
    <>
      <View className="flex-row items-center justify-between">
        <Pressable onPress={onBack} className="h-8 w-8 items-center justify-center">
          <ArrowLeft size={19} color="#0E33F3" />
        </Pressable>
        <Text className="font-sans-bold text-lg text-primary">
          John Miko&apos;s
        </Text>
        <View className="h-8 w-8" />
      </View>

      <View className="gap-0.5">
        <Text className="font-sans-bold text-lg text-neutral-dark-1">
          Booking details
        </Text>
        <Text className="text-sm text-neutral-grey-1">
          Reference: {reference}
        </Text>
      </View>
    </>
  );
}
