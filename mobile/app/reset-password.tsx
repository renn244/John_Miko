import AuthScreenShell from "@/components/auth/AuthScreenShell";
import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/passwordInput";
import { useResetPasswordMutation } from "@/hooks/auth.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View
} from "react-native";
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

const passwordChecks = [
    {
        label: "8+ Characters",
        test: (value: string) => value.length >= 8,
    },
    {
        label: "Lowercase",
        test: (value: string) => /[a-z]/.test(value),
    },
    {
        label: "Uppercase",
        test: (value: string) => /[A-Z]/.test(value),
    },
    {
        label: "1 Number",
        test: (value: string) => /\d/.test(value),
    },
    {
        label: "1 Special Char",
        test: (value: string) => /[^A-Za-z0-9]/.test(value),
    },
];

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
    const newPasswordValue = useWatch({ control, name: "newPassword" }) ?? "";
    const showPasswordChecklistErrors = Boolean(errors.newPassword);

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
            <AuthScreenShell
                cue="Security alert"
                cueIcon={<AlertTriangle color="#AB091E" height={12} width={12} />}
                cueTone="danger"
                title="Reset link is invalid"
                subtitle="Request a new password reset email to continue."
            >
                <View className="gap-4">
                    <Button onPress={() => router.replace('/forgot-password')}>
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
            </AuthScreenShell>
        );
    }

    return (
        <AuthScreenShell
            cue={isSubmitted ? "Password updated" : "Secure password reset"}
            cueIcon={
                isSubmitted ? (
                    <CheckCircle2 color="#014D40" height={12} width={12} />
                ) : (
                    <ShieldCheck color="#0B69A3" height={12} width={12} />
                )
            }
            cueTone={isSubmitted ? "success" : "info"}
            title={isSubmitted ? "Password updated" : "Create new password"}
            subtitle={
                isSubmitted
                    ? "You can now log in with your new password."
                    : "Choose a strong password for your staff workspace."
            }
            showHeader={!isSubmitted}
        >
                <View className="gap-6">
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
                                                surface="white"
                                                leftIcon={<LockKeyhole color="#6B7580" height={18} width={18} />}
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={field.onBlur}
                                            />
                                        )}
                                    />
                                    <View className="flex-row flex-wrap gap-1.5 pt-1">
                                        {passwordChecks.map((check) => {
                                            const passed = check.test(newPasswordValue);
                                            const failed = showPasswordChecklistErrors && !passed;

                                            return (
                                                <View
                                                    key={check.label}
                                                    className={`flex-row items-center gap-1 rounded-sm px-2 py-1 ${
                                                        passed
                                                            ? "bg-secondary-green-light"
                                                            : failed
                                                                ? "border border-system-red/20 bg-system-red/10"
                                                                : "bg-secondary-blue-light"
                                                    }`}
                                                >
                                                    {passed ? (
                                                        <CheckCircle2 color="#014D40" height={10} width={10} />
                                                    ) : (
                                                        <View className={`h-2.5 w-2.5 rounded-full border ${
                                                            failed ? "border-system-red" : "border-primary"
                                                        }`} />
                                                    )}
                                                    <Text className={`font-sans-semibold text-sm ${
                                                        passed
                                                            ? "text-secondary-green-dark"
                                                            : failed
                                                                ? "text-system-red"
                                                                : "text-neutral-dark-1"
                                                    }`}>
                                                        {check.label}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
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
                                                surface="white"
                                                leftIcon={<LockKeyhole color="#6B7580" height={18} width={18} />}
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
                        <View className="rounded-xl border border-neutral-soft-grey-1 bg-white px-8 py-10 shadow-sm">
                            <View className="items-center gap-5">
                                <View className="size-10 items-center justify-center rounded-full bg-primary">
                                    <AlertTriangle color="#FFFFFF" height={20} width={20} />
                                </View>

                                <View className="flex-row items-center gap-2 rounded-full bg-secondary-green-light px-4 py-2">
                                    <CheckCircle2 color="#014D40" height={14} width={14} />
                                    <Text className="font-sans-semibold text-sm uppercase tracking-wide text-secondary-green-dark">
                                        Password updated
                                    </Text>
                                </View>

                                <View className="items-center gap-1">
                                    <Text className="text-center font-sans-bold text-2xl text-neutral-dark-1">
                                        Password updated
                                    </Text>
                                    <Text className="max-w-60 text-center text-base leading-5 text-neutral-grey-1">
                                        You can now log in with your new password.
                                    </Text>
                                </View>

                                <Button
                                    onPress={() => router.replace('/login')}
                                    className="mt-2 w-full"
                                >
                                    <Text className="text-white font-sans-semibold text-lg">
                                        Go to Login
                                    </Text>
                                </Button>

                                <Text className="text-center text-neutral-grey-1 text-sm">
                                    Redirecting in {redirectTimer}s
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
        </AuthScreenShell>
    );
}
