import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import ProfileDetailsForm from "@/components/settings/ProfileDetailsForm";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import ScreenState from "@/components/ui/screen-state";
import { useSession } from "@/context/SessionContext";
import { type RoleTourTargetProps, useRoleTour } from "@/context/RoleTourContext";
import { useProfileQuery } from "@/hooks/profile.hook";
import type { TourScrollViewProps } from "@/hooks/roleTours/useTourScrollContainer";
import { getRoleRoute } from "@/lib/roleRoutes";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  CircleHelp,
} from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import ProfileCard from "./ProfileCard";

type StaffSettingsScreenProps = {
  replayGuideTargetProps?: RoleTourTargetProps;
  tourScrollViewProps?: TourScrollViewProps;
};

const StaffSettingsScreen = ({
  replayGuideTargetProps,
  tourScrollViewProps,
}: StaffSettingsScreenProps) => {
  const router = useRouter();
  const { signOut } = useSession();
  const { requestReplay } = useRoleTour();
  const { data: user, isLoading, refetch } = useProfileQuery();

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const handleReplayRoleGuide = () => {
    requestReplay(user!);
    router.replace(getRoleRoute(user!.role));
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
        {...tourScrollViewProps}
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

        <View {...replayGuideTargetProps}>
          <Button
            variant="outline"
            onPress={handleReplayRoleGuide}
            className="rounded-md"
          >
            <CircleHelp size={19} color="#0E33F3" />
            <Text className="font-sans-semibold text-base text-primary">
              Replay role guide
            </Text>
          </Button>
        </View>

        <Button
          variant="outline"
          onPress={handleLogout}
          className="rounded-md border-system-red/30 bg-system-red/10"
        >
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
          <Text className="font-sans-semibold text-base text-primary">
            Back to Login
          </Text>
        </Button>
      </View>
    </CustomSafeAreaView>
  )
}

export default StaffSettingsScreen;
