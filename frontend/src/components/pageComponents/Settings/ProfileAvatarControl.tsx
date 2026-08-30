import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useCloudinaryUpload } from "@/hooks/cloudinary.hook";
import { useUpdateProfileImageMutation } from "@/hooks/auth.hook";
import type { UserProfileDto } from "@/types/auth.types";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRef } from "react";

type ProfileAvatarControlProps = {
  user: UserProfileDto;
};

const ProfileAvatarControl = ({ user }: ProfileAvatarControlProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, status, progress, error } = useCloudinaryUpload();
  const { mutateAsync: updateProfileImage, isPending: isSaving } = useUpdateProfileImageMutation();
  const isBusy = status === "uploading" || isSaving;
  const hasAvatar = Boolean(user.profileImageUrl);

  const handleFileChange = async (file?: File) => {
    if (!file) return;

    try {
      const profileImageUrl = await upload(file, "PROFILE_AVATAR");
      await updateProfileImage(profileImageUrl);
    } catch {
      // Upload and save hooks already show the relevant error state.
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <UserAvatar
        avatarUrl={user.profileImageUrl ?? ""}
        name={user.name || user.email}
        size="default"
        className="size-28 shrink-0 text-2xl"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{hasAvatar ? "Your current profile photo" : "Use a profile photo"}</p>
        <FieldDescription className="mt-1">
          JPG, PNG, or WebP up to 10 MB. Photos display as a centered circle.
        </FieldDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => inputRef.current?.click()}
          >
            {status === "uploading" || isSaving ? <LoadingSpinner /> : <ImagePlus />}
            {hasAvatar ? "Replace photo" : "Upload photo"}
          </Button>
          {hasAvatar ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isBusy}
              onClick={() => void updateProfileImage(null)}
            >
              {isSaving ? <LoadingSpinner /> : <Trash2 />}
              Remove
            </Button>
          ) : null}
        </div>
        {status === "uploading" ? (
          <p className="mt-2 text-sm text-muted-foreground">Uploading photo… {progress}%</p>
        ) : null}
        {status === "error" && error ? (
          <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>
        ) : null}
      </div>
      <input
        ref={inputRef}
        id="profile-image"
        aria-label="Profile photo"
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={isBusy}
        onChange={(event) => void handleFileChange(event.target.files?.[0])}
      />
    </div>
  );
};

export default ProfileAvatarControl;
