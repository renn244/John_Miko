import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import OperationalCard from "@/components/ui/operational-card";
import { PasswordInput } from "@/components/ui/passwordInput";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useChangePasswordMutation } from "@/hooks/profile.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, ShieldCheck } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().nonempty("Current password is required"),
  newPassword: z.string().nonempty("New password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/\d/, "Password must contain a number")
        .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
  confirmPassword: z.string().nonempty("Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from your current password",
  path: ["newPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isDirty },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    criteriaMode: "all",
  });

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePasswordMutation<ChangePasswordFormValues>(setError);

  const onChangePasswordSubmit = (data: ChangePasswordFormValues) => {
    changePassword(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <OperationalCard contentClassName="gap-5 px-5 py-5">
      <View className="gap-1">
        <Text className="font-sans-bold text-xl text-neutral-dark-1">
          Change password
        </Text>
        <Text className="text-base text-neutral-grey-1">
          Use at least 8 characters with uppercase and lowercase letters, a number, and a special character.
        </Text>
      </View>

      <View className="gap-4">
        <Controller
          name="currentPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="gap-1">
              <FieldLabel className="text-base">Current Password</FieldLabel>
              <PasswordInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Current password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                invalid={Boolean(fieldState.error)}
                surface="white"
                leftIcon={<LockKeyhole size={18} color="#6B7580" />}
              />
              <FieldError errors={getErrorMessages(fieldState.error)} />
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="gap-1">
              <FieldLabel className="text-base">New Password</FieldLabel>
              <PasswordInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter new password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                invalid={Boolean(fieldState.error)}
                surface="white"
                leftIcon={<ShieldCheck size={18} color="#6B7580" />}
              />
              <FieldError errors={getErrorMessages(fieldState.error)} />
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="gap-1">
              <FieldLabel className="text-base">Confirm New Password</FieldLabel>
              <PasswordInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Confirm new password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                invalid={Boolean(fieldState.error)}
                surface="white"
                leftIcon={<ShieldCheck size={18} color="#6B7580" />}
              />
              <FieldError errors={getErrorMessages(fieldState.error)} />
            </Field>
          )}
        />

        <Button
          onPress={handleSubmit(onChangePasswordSubmit)}
          disabled={isChangingPassword || !isDirty}
          className="rounded-md"
        >
          {isChangingPassword ? (
            <LoadingIndicator tone="inverse" />
          ) : (
            <Text className="font-sans-semibold text-base text-white">
              Update Password
            </Text>
          )}
        </Button>
      </View>
    </OperationalCard>
  );
};

export default ChangePasswordForm;
