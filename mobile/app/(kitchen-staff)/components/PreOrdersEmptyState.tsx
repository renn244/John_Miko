import { Button } from "@/components/ui/Button";
import { Text, View } from "react-native";

type PreOrdersEmptyStateProps = {
  hasError?: boolean;
  onRetry?: () => void;
};

export default function PreOrdersEmptyState({ hasError, onRetry }: PreOrdersEmptyStateProps) {
  return (
    <View className="items-center justify-center py-14">
      <Text className="font-sans-semibold text-lg text-neutral-dark-1">
        No pre-orders found
      </Text>
      <Text className="mt-2 text-base text-neutral-grey-1 text-center">
        Try changing the filters or pull to refresh.
      </Text>

      {hasError ? (
        <View className="mt-5 w-full">
          <Button
            variant="outline"
            onPress={onRetry}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="text-neutral-dark-1 font-sans-semibold text-lg">
              Retry
            </Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
}
