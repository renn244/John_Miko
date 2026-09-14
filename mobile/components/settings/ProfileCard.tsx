import { ProfileResponse } from '@/types/auth.type';
import { Image } from 'expo-image';
import { Mail, Phone } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import OperationalCard from '../ui/operational-card';
import StatusChip from '../ui/status-chip';

const getInitials = (name?: string | null) => {
    if (!name?.trim()) return "JM";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase()).join("");
};

const roleLabels: Record<ProfileResponse["role"], string> = {
    KITCHEN_STAFF: "Kitchen Staff",
    RESORT_STAFF: "Resort Staff",
    MAINTENANCE_STAFF: "Maintenance Staff",
};

type ProfileCardProps = {
    user: ProfileResponse
}

const ProfileCard = ({
    user
}: ProfileCardProps) => {
    return (
        <OperationalCard contentClassName="gap-4 px-5 py-5">
            <View className="flex-row items-start gap-4">
                {user.profileImageUrl ? (
                    <Image
                      source={{ uri: user.profileImageUrl }}
                      contentFit="cover"
                      className="h-16 w-16 shrink-0 rounded-full bg-primary"
                      accessibilityLabel={`${user.name || "Staff member"} profile picture`}
                    />
                ) : (
                    <View className="h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Text className="font-sans-bold text-2xl text-white">
                        {getInitials(user.name)}
                      </Text>
                    </View>
                )}
                <View className="flex-1 gap-2" style={{ minWidth: 0 }}>
                    <Text
                        className="font-sans-bold text-xl text-neutral-dark-1"
                        style={{ flexShrink: 1 }}
                        numberOfLines={2}
                    >
                        {user.name || "Staff Member"}
                    </Text>
                    <InfoLine
                        icon={<Mail size={14} color="#6B7580" />}
                        text={user.email}
                    />
                    <InfoLine
                        icon={<Phone size={14} color="#6B7580" />}
                        text={user.contactNo}
                    />
                </View>
            </View>
            <View className="flex-row flex-wrap items-center gap-2">
                <StatusChip label={roleLabels[user.role]} tone="info" size="sm" className="max-w-full" textClassName="shrink" />
                <StatusChip
                    label={user.status}
                    tone={user.status === "ACTIVE" ? "approved" : "rejected"}
                    size="sm"
                    uppercase
                    className="max-w-full"
                    textClassName="shrink"
                />
            </View>
        </OperationalCard>
    ) 
}

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <View className="flex-row items-center gap-2">
      {icon}
      <Text
        className="flex-1 text-base text-neutral-grey-1"
      >
        {text}
      </Text>
    </View>
  );
}

export default ProfileCard;
