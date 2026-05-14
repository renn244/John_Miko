import Logo from "@/assets/app/logo/logo.svg";
import { Button } from "@/components/ui/Button";
import CustomSafeArea from "@/components/ui/CustomSafeAreaView";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/passwordInput";
import { useResetPasswordMutation } from "@/hooks/auth.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";

const ResetPasswordSchema = z.object({
    token: z.string().nonempty("Reset token is missing"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/\d/, "Password must contain a number")
        .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirmPassword: z.string().nonempty("Confirm password is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export default function ResetPassword() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [redirectTimer, setRedirectTimer] = useState(3);

    const { token } = useLocalSearchParams<{ token?: string | string[] }>();
    const tokenValue = Array.isArray(token) ? token[0] : token;
    const hasToken = typeof tokenValue === "string" && tokenValue.length > 0;

    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            token: tokenValue ?? "",
            newPassword: "",
            confirmPassword: "",
        },
        criteriaMode: "all",
    });

    const { mutateAsync: resetPassword, isPending } =
        useResetPasswordMutation<ResetPasswordSchemaType>(setError);

    useEffect(() => {
        if (tokenValue) {
            setValue("token", tokenValue);
        }
    }, [tokenValue, setValue]);

    useEffect(() => {
        if (!isSubmitted) return;

        setRedirectTimer(3);
        const countdown = setInterval(() => {
            setRedirectTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        const redirect = setTimeout(() => {
            router.replace('/login');
        }, 3000);

        return () => {
            clearInterval(countdown);
            clearTimeout(redirect);
        };
    }, [isSubmitted, router]);

    const handleReset = async (data: ResetPasswordSchemaType) => {
        try {
            await resetPassword(data);
            setIsSubmitted(true);
        } catch {
            return;
        }
    };

    if (!hasToken) {
        return (
            <CustomSafeArea className="justify-center">
                <View className="px-5 gap-4">
                    <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                        Reset link is invalid
                    </Text>
                    <Text className="text-neutral-grey-1 text-base">
                        Request a new password reset email to continue.
                    </Text>
                    <Button onPress={() => router.replace('./forgot-password')}>
                        <Text className="text-white font-sans-semibold text-lg">
                            Request New Link
                        </Text>
                    </Button>
                    <Pressable onPress={() => router.replace('/login')}>
                        <Text className="text-primary font-sans-semibold text-base">
                            Back to Login
                        </Text>
                    </Pressable>
                </View>
            </CustomSafeArea>
        );
    }

    return (
        <CustomSafeArea>
            <KeyboardAwareScrollView
            className="flex-1"
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                paddingVertical: 32,
            }}
            bottomOffset={32}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            >
                <View className="px-5 gap-6">
                    <View className="items-center gap-1">
                        <Logo height={40} width={40} />
                        <Text className="font-sans-bold text-2xl text-neutral-dark-1">
                            Reset Password
                        </Text>
                        <Text className="text-center text-neutral-grey-1 text-base">
                            Create a new password for your account.
                        </Text>
                    </View>

                    {!isSubmitted ? (
                        <>
                            <FieldSet className="gap-2">
                            

                                <Field className="gap-1">
                                    <FieldLabel className="text-base">New Password</FieldLabel>
                                    <Controller
                                        name="newPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <PasswordInput
                                                textContentType="newPassword"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                placeholder="New password"
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={field.onBlur}
                                                invalid={Boolean(errors.newPassword)}
                                            />
                                        )}
                                    />
                                    <FieldError errors={getErrorMessages(errors.newPassword)} />
                                </Field>

                                <Field className="gap-1">
                                    <FieldLabel className="text-base">Confirm Password</FieldLabel>
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <PasswordInput
                                                textContentType="newPassword"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                placeholder="Confirm password"
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={field.onBlur}
                                                invalid={Boolean(errors.confirmPassword)}
                                            />
                                        )}
                                    />
                                    <FieldError errors={getErrorMessages(errors.confirmPassword)} />
                                </Field>
                            </FieldSet>

                            <View className="pt-6">
                                <Button
                                onPress={handleSubmit(handleReset)}
                                disabled={isPending}
                                style={({ pressed }: { pressed: boolean }) => ({
                                    opacity: pressed ? 0.85 : isPending ? 0.7 : 1,
                                })}
                                >
                                    {isPending ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text className="text-white font-sans-semibold text-lg">
                                            Update Password
                                        </Text>
                                    )}
                                </Button>
                            </View>

                            <Pressable
                            onPress={() => router.replace('/login')}
                            className="items-center pt-4"
                            >
                                <Text className="text-primary font-sans-semibold text-base">
                                    Back to Login
                                </Text>
                            </Pressable>
                        </>
                    ) : (
                        <View className="items-center gap-3">
                            <View className="size-16 rounded-full bg-secondary-green-light items-center justify-center">
                                <CheckCircle color="#3EBD93" width={32} height={32} />
                            </View>
                            <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                                Password updated
                            </Text>
                            <Text className="text-center text-neutral-grey-1 text-base">
                                You can now log in with your new password.
                            </Text>
                            <Text className="text-neutral-grey-1 text-base">
                                Redirecting in {redirectTimer}s
                            </Text>
                            <Button onPress={() => router.replace('/login')}>
                                <Text className="text-white font-sans-semibold text-lg">
                                    Go to Login
                                </Text>
                            </Button>
                        </View>
                    )}
                </View>
            </KeyboardAwareScrollView>
        </CustomSafeArea>
    );
}
