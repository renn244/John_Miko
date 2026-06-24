import { ArrowLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

type DetailHeaderProps = {
  onBack: () => void;
  title: string;
  badge?: string;
};

export function DetailHeader({ onBack, title, badge }: DetailHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 border-b border-neutral-soft-grey-2 bg-neutral-soft-grey-3 px-5 py-4">
      <Pressable onPress={onBack} className="h-9 w-9 items-center justify-center">
        <ArrowLeft size={26} color="#0E33F3" />
      </Pressable>
      <Text className="flex-1 font-sans-bold text-xl text-neutral-dark-1">
        {title}
      </Text>
      {badge ? (
        <View className="max-w-36 rounded-md bg-secondary-blue-light px-3 py-2">
          <Text className="font-sans-bold text-base text-neutral-dark-2" numberOfLines={1}>
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
