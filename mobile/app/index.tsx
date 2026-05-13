import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { Link } from "expo-router";
import { Text } from "react-native";
  
export default function Index() {
  return (
    <CustomSafeAreaView className="px-5">
      <Text>John Miko's</Text>
        <Button>
          <Link href="/onboarding">
            <Text className="font-sans-semibold text-white text-lg">
              LET'S GO
            </Text>
          </Link>
        </Button>
    </CustomSafeAreaView>
  );
}
