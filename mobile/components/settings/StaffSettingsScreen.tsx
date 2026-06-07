import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import { useChangePasswordMutation, useProfileQuery, useUpdateProfileMutation } from "@/hooks/profile.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { deleteAccessToken } from "@/lib/tokenStorage";
import type { ProfileResponse } from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { LockKeyhole, LogOut, Save, ShieldCheck } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().trim().nonempty("Name is required"),
    email: z.string().email("Email is required").nonempty("Email is required"),
    contactNo: z.string().trim().nonempty("Contact number is required"),
});

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

type ProfileFormValues = z.infer<typeof profileSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const roleLabels: Record<ProfileResponse["role"], string> = {
    KITCHEN_STAFF: "Kitchen Staff",
    RESORT_STAFF: "Resort Staff",
};

const StaffSettingsScreen = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: user, isLoading, refetch } = useProfileQuery();

    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        setError: setProfileError,
        formState: { isDirty: isProfileDirty },
        reset: resetProfileForm,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            contactNo: user?.contactNo ?? "",
        },
        criteriaMode: "all",
    });

    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        setError: setPasswordError,
        reset: resetPasswordForm,
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        criteriaMode: "all",
    });

    const { mutateAsync: updateProfile, isPending: isSavingProfile } =
        useUpdateProfileMutation<ProfileFormValues>(setProfileError);
    const { mutateAsync: changePassword, isPending: isChangingPassword } =
        useChangePasswordMutation<ChangePasswordFormValues>(setPasswordError);

    useEffect(() => {
        resetProfileForm({
            name: user?.name ?? "",
            email: user?.email ?? "",
            contactNo: user?.contactNo ?? "",
        })
    }, [resetProfileForm, user])

    const onProfileSubmit = async (data: ProfileFormValues) => {
        await updateProfile(data);
    };

    const onChangePasswordSubmit = async (data: ChangePasswordFormValues) => {
        await changePassword(data);
        resetPasswordForm();
    };

    const handleLogout = async () => {
        await deleteAccessToken();
        await queryClient.clear();
        router.replace("/login");
    };

    const isChangePasswordDisabled = !passwordControl._formValues.currentPassword || !passwordControl._formValues.newPassword || !passwordControl._formValues.confirmPassword;

    if (isLoading) {
        return (
            <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 items-center justify-center">
                <ActivityIndicator size="large" />
            </CustomSafeAreaView>
        );
    }

    if (!user) {
        return (
            <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
                <View className="flex-1 items-center justify-center px-6 gap-4">
                    <Text className="font-sans-semibold text-2xl text-neutral-dark-1">
                        Unable to load account
                    </Text>
                    <Text className="text-center text-base text-neutral-grey-1">
                        Pull your account details again or return to login if the session expired.
                    </Text>
                    <View className="w-full gap-3">
                        <Button onPress={() => refetch()}>
                            <Text className="text-white font-sans-semibold text-lg">Retry</Text>
                        </Button>
                        <Button variant="outline" onPress={handleLogout}>
                            <Text className="font-sans-semibold text-lg text-neutral-dark-1">Back to Login</Text>
                        </Button>
                    </View>
                </View>
            </CustomSafeAreaView>
        );
    }

    return (
        <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
            <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            >
                <View className="gap-5">
                    <View>
                        <Text className="font-sans-bold text-3xl text-neutral-dark-1">
                            Settings
                        </Text>
                        <Text className="mt-1 text-base text-neutral-grey-1">
                            Update your staff profile details and password.
                        </Text>
                    </View>

                    <View className="rounded-3xl bg-white px-5 py-5 shadow-sm gap-4">
                        <View className="flex-row items-center gap-3">
                            <View className="h-12 w-12 rounded-full bg-primary/15 items-center justify-center">
                                <ShieldCheck color="#1E73BE" size={22} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                                    Account Overview
                                </Text>
                                <Text className="text-base text-neutral-grey-1">
                                    {roleLabels[user.role]} • {user.status}
                                </Text>
                            </View>
                        </View>

                        <View className="rounded-2xl bg-neutral-soft-grey-3 px-4 py-4 gap-2">
                            <Text className="text-sm text-neutral-grey-1">Current Email</Text>
                            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                                {user.email}
                            </Text>
                        </View>
                    </View>

                    <View className="rounded-3xl bg-white px-5 py-5 shadow-sm gap-4">
                        <View className="gap-1">
                            <Text className="font-sans-semibold text-2xl text-neutral-dark-1">
                                Profile Details
                            </Text>
                            <Text className="text-base text-neutral-grey-1">
                                Keep your name, email, and contact number current.
                            </Text>
                        </View>

                        <View className="gap-4">
                            <Controller
                                name="name"
                                control={profileControl}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-1">
                                        <FieldLabel className="text-base">Name</FieldLabel>
                                        
                                        <Input
                                        placeholder="Your full name"
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
                                name="email"
                                control={profileControl}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-1">
                                        <FieldLabel className="text-base">Email</FieldLabel>
                                        <Input
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="Email"
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        invalid={Boolean(fieldState.error)}
                                        />
                                        <FieldDescription>
                                            This email stays tied to your staff login.
                                        </FieldDescription>
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="contactNo"
                                control={profileControl}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-1">
                                        <FieldLabel className="text-base">Contact Number</FieldLabel>
                                        <Input
                                        keyboardType="phone-pad"
                                        placeholder="09XXXXXXXXX"
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
                            onPress={handleProfileSubmit(onProfileSubmit)}
                            disabled={isSavingProfile || !isProfileDirty}
                            >
                                {isSavingProfile ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Save color="#FFFFFF" size={18} />
                                        <Text className="text-white font-sans-semibold text-lg">
                                            Save Changes
                                        </Text>
                                    </>
                                )}
                            </Button>
                        </View>
                    </View>

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
                                control={passwordControl}
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
                                control={passwordControl}
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
                                control={passwordControl}
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
                            onPress={handlePasswordSubmit(onChangePasswordSubmit)}
                            disabled={isChangingPassword || isChangePasswordDisabled}
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

                    <Button
                    variant="outline"
                    onPress={handleLogout}
                    className="bg-system-red"
                    >
                        <LogOut color="#FFFFFF" size={18} />
                        <Text className="font-sans-semibold text-lg text-white">
                            Log Out
                        </Text>
                    </Button>
                </View>
            </ScrollView>
        </CustomSafeAreaView>
    );
};

export default StaffSettingsScreen;
