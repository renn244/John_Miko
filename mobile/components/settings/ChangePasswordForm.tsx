import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/passwordInput";
import { useChangePasswordMutation } from "@/hooks/profile.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import { z } from "zod";

const changePasswordSchema = z.object({
    currentPassword: z.string().nonempty("Current password is required"),
    newPassword: z.string().nonempty("New password is required"),
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
        formState: { isDirty }
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        criteriaMode: "all",
    });

    const { mutateAsync: changePassword, isPending: isChangingPassword } =
        useChangePasswordMutation<ChangePasswordFormValues>(setError);

    const onChangePasswordSubmit = async (data: ChangePasswordFormValues) => {
        await changePassword(data);
        reset();
    };

    return (
        <View className="rounded-3xl bg-white px-5 py-5 shadow-sm gap-4">
            <View className="gap-1">
                <Text className="font-sans-semibold text-2xl text-neutral-dark-1">
                    Change Password
                </Text>
                <Text className="text-base text-neutral-grey-1">
                    Use a new password that is different from your current one.
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
                                placeholder="New password"
                                value={field.value}
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                invalid={Boolean(fieldState.error)}
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
                            />
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        </Field>
                    )}
                />

                <Button
                    onPress={handleSubmit(onChangePasswordSubmit)}
                    disabled={isChangingPassword || !isDirty}
                >
                    {isChangingPassword ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <LockKeyhole color="#FFFFFF" size={18} />
                            <Text className="text-white font-sans-semibold text-lg">
                                Update Password
                            </Text>
                        </>
                    )}
                </Button>
            </View>
        </View>
    );
};

export default ChangePasswordForm;
