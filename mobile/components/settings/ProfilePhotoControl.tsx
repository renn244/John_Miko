import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/Button";
import OperationalCard from "@/components/ui/operational-card";
import { useUpdateProfileImageMutation } from "@/hooks/profile.hook";
import type { ProfileResponse } from "@/types/auth.type";
import { Trash2 } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type ProfilePhotoControlProps = {
  user: ProfileResponse;
};

const ProfilePhotoControl = ({ user }: ProfilePhotoControlProps) => {
  const { mutate: updateProfileImage, isPending: isSaving } = useUpdateProfileImageMutation();
  const [isUploading, setIsUploading] = useState(false);
  const isBusy = isUploading || isSaving;

  return (
    <OperationalCard contentClassName="gap-5 px-5 py-5">
      <View className="gap-1">
        <Text className="font-sans-bold text-xl text-neutral-dark-1">Profile photo</Text>
        <Text className="text-base text-neutral-grey-1">
          Upload a photo to personalize your account. It displays as a centered circle.
        </Text>
      </View>

      <CloudinaryUpload
        purpose="PROFILE_AVATAR"
        label={user.profileImageUrl ? "Replace profile photo" : "Upload profile photo"}
        disabled={isBusy}
        onUploadingChange={setIsUploading}
        onSuccess={(profileImageUrl) => updateProfileImage(profileImageUrl)}
      />

      {user.profileImageUrl ? (
        <Button
          variant="destructive"
          disabled={isBusy}
          onPress={() => updateProfileImage(null)}
        >
          {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Trash2 size={18} color="#FFFFFF" />}
          <Text className="font-sans-semibold text-base text-white">Remove photo</Text>
        </Button>
      ) : null}
    </OperationalCard>
  );
};

export default ProfilePhotoControl;
