import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import ProfileDetailsForm from "@/components/settings/ProfileDetailsForm";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import ScreenState from "@/components/ui/screen-state";
import { useProfileQuery } from "@/hooks/profile.hook";
import { deleteAccessToken } from "@/lib/tokenStorage";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  LogOut
} from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import ProfileCard from "./ProfileCard";

const StaffSettingsScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading, refetch } = useProfileQuery();

  const handleLogout = async () => {
    await deleteAccessToken();
    await queryClient.clear();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (!user) {
    return (
      <ErrorState refetch={refetch} handleLogout={handleLogout} />
    );
  }

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 36,
          gap: 18,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <Text className="font-sans-bold text-3xl text-neutral-dark-1">
            Settings
          </Text>
          <Text className="text-base text-neutral-grey-1">
            Update your staff profile details and password.
          </Text>
        </View>

        <ProfileCard user={user} />

        <ProfileDetailsForm user={user} />

        <ChangePasswordForm />

        <Button
          variant="outline"
          onPress={handleLogout}
          className="rounded-md border-system-red/30 bg-system-red/10"
        >
          <LogOut color="#AB091E" size={18} />
          <Text className="font-sans-semibold text-base text-system-red">
            Log Out
          </Text>
        </Button>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const LoadingState = () => {
  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="flex-1 items-center justify-center gap-4">
        <ActivityIndicator size="large" />
        <Text className="text-lg text-neutral-dark-2">
          Loading account...
        </Text>
      </View>
    </CustomSafeAreaView>
  )
}

const ErrorState = ({
  refetch,
  handleLogout
}: {
  refetch: () => void,
  handleLogout: () => void,
}) => {
  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
      <View className="flex-1 items-center justify-center">
        <ScreenState
          tone="danger"
          icon={<AlertTriangle size={24} color="#AB091E" />}
          title="Unable to load account"
          description="Pull your account details again or return to login if the session expired."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
        <Button variant="outline" onPress={handleLogout} className="mt-2 w-full">
          <LogOut color="#0E33F3" size={18} />
          <Text className="font-sans-semibold text-base text-primary">
            Back to Login
          </Text>
        </Button>
      </View>
    </CustomSafeAreaView>
  )
}

export default StaffSettingsScreen;