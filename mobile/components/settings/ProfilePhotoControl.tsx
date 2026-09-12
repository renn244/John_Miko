import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/Button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import OperationalCard from "@/components/ui/operational-card";
import { useUpdateProfileImageMutation } from "@/hooks/profile.hook";
import type { ProfileResponse } from "@/types/auth.type";
import { Trash2 } from "lucide-react-native";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { Text, View } from "react-native";

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
          Choose a JPG, PNG, or WebP image up to 10 MB. It displays as a centered circle.
        </Text>
      </View>

      <CloudinaryUpload
        purpose="PROFILE_AVATAR"
        label={user.profileImageUrl ? "Replace profile photo" : "Upload profile photo"}
        disabled={isBusy}
        onUploadingChange={setIsUploading}
        onSuccess={(profileImageUrl) => updateProfileImage(profileImageUrl)}
        onError={(error) => toast.error(error.message)}
      />

      {isSaving ? <Text accessibilityLiveRegion="polite">Saving profile photo...</Text> : null}

      {user.profileImageUrl ? (
        <Button
          variant="destructive"
          disabled={isBusy}
          onPress={() => updateProfileImage(null)}
        >
          {isSaving ? <LoadingIndicator tone="inverse" /> : <Trash2 size={18} color="#FFFFFF" />}
          <Text className="font-sans-semibold text-base text-white">Remove photo</Text>
        </Button>
      ) : null}
    </OperationalCard>
  );
};

export default ProfilePhotoControl;
