import OperationalCard from "@/components/ui/operational-card";
import SectionTitle from "@/components/ui/section-title";
import { Text, View } from "react-native";

type SpecialRequestsCardProps = {
  specialRequests: string | null;
};

export function SpecialRequestsCard({
  specialRequests,
}: SpecialRequestsCardProps) {
  const requests = specialRequests?.trim()
    ? specialRequests.split("\n").filter(Boolean)
    : ["No special requests."];

  return (
    <OperationalCard leftAccentClassName="bg-secondary-blue-light" contentClassName="gap-3 px-3 py-3">
      <SectionTitle title="Special requests" />
      <View className="gap-2">
        {requests.map((request, index) => (
          <View
            key={`${request}-${index}`}
            className="rounded-sm bg-secondary-blue-light/50 px-3 py-2"
          >
            <Text className="text-base leading-5 text-neutral-dark-2">
              {request}
            </Text>
          </View>
        ))}
      </View>
    </OperationalCard>
  );
}
