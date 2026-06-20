import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import ProfileDetailsForm from "@/components/settings/ProfileDetailsForm";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip from "@/components/ui/status-chip";
import { useProfileQuery } from "@/hooks/profile.hook";
import { deleteAccessToken } from "@/lib/tokenStorage";
import type { ProfileResponse } from "@/types/auth.type";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  Mail,
  Phone,
  LogOut,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const roleLabels: Record<ProfileResponse["role"], string> = {
  KITCHEN_STAFF: "Kitchen Staff",
  RESORT_STAFF: "Resort Staff",
  MAINTENANCE_STAFF: "Maintenance Staff",
};

const getInitials = (name?: string | null) => {
  if (!name?.trim()) return "JM";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("");
};

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
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator size="large" />
          <Text className="text-lg text-neutral-dark-2">
            Loading account...
          </Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (!user) {
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

        <OperationalCard contentClassName="gap-4 px-5 py-5">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-xl bg-primary">
              <Text className="font-sans-bold text-2xl text-white">
                {getInitials(user.name)}
              </Text>
            </View>
            <View className="flex-1 gap-2">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text
                  className="max-w-36 font-sans-bold text-xl text-neutral-dark-1"
                  numberOfLines={1}
                >
                  {user.name || "Staff Member"}
                </Text>
                <StatusChip
                  label={roleLabels[user.role]}
                  tone="info"
                  size="sm"
                />
              </View>
              <InfoLine
                icon={<Mail size={14} color="#6B7580" />}
                text={user.email}
              />
              <InfoLine
                icon={<Phone size={14} color="#6B7580" />}
                text={user.contactNo}
              />
            </View>
            <StatusChip
              label={user.status}
              tone={user.status === "ACTIVE" ? "approved" : "rejected"}
              size="sm"
              uppercase
            />
          </View>
        </OperationalCard>

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

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <View className="flex-row items-center gap-2">
      {icon}
      <Text
        className="flex-1 text-base text-neutral-grey-1"
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}

export default StaffSettingsScreen;
