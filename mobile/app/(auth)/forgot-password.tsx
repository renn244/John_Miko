import AuthScreenShell from "@/components/auth/AuthScreenShell";
import { Button } from "@/components/ui/Button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    useForgotPasswordMutation,
    useResendForgotPasswordMutation
} from "@/hooks/auth.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Pressable,
    Text,
    View
} from "react-native";
import { z } from "zod";

const ForgotPasswordSchema = z.object({
    email: z.email("Invalid email").nonempty("Email is required"),
});

type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [isResendAllowed, setIsResendAllowed] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
        criteriaMode: "all",
    });

    const { mutateAsync: sendResetEmail, isPending: isSending } =
        useForgotPasswordMutation<ForgotPasswordSchemaType>(setError);
    const { mutateAsync: resendResetEmail, isPending: isResending } =
        useResendForgotPasswordMutation();

    const router = useRouter();

    useEffect(() => {
        if (!isSubmitted) return;

        if (resendTimer <= 0) {
            setIsResendAllowed(true);
            return;
        }

        const timeout = setTimeout(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isSubmitted, resendTimer]);

    const handleSendEmail = async (data: ForgotPasswordSchemaType) => {
        try {
            await sendResetEmail(data);
            setEmail(data.email);
            setIsSubmitted(true);
            setIsResendAllowed(false);
            setResendTimer(30);
        } catch {
            return;
        }
    };

    const handleResend = async () => {
        if (!email) return;

        try {
            await resendResetEmail({ email });
            setIsResendAllowed(false);
            setResendTimer(30);
        } catch {
            return;
        }
    };

    return (
        <AuthScreenShell
            cue={isSubmitted ? "Reset link sent" : "Secure staff access"}
            cueIcon={
                isSubmitted ? (
                    <CheckCircle2 color="#014D40" height={12} width={12} />
                ) : (
                    <ShieldCheck color="#0B69A3" height={12} width={12} />
                )
            }
            cueTone={isSubmitted ? "success" : "info"}
            title={isSubmitted ? "Check your email" : "Reset your password"}
            subtitle={
                isSubmitted
                    ? "We sent reset instructions to your staff email."
                    : "Enter your staff email and we'll send instructions to help you get back in."
            }
        >
                <View className="gap-6">
                    {!isSubmitted ? (
                        <>
                            <FieldSet className="gap-2">
                                <Field className="gap-1">
                                    <FieldLabel className="text-base">Email</FieldLabel>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            placeholder="Email"
                                            surface="white"
                                            leftIcon={<Mail color="#6B7580" height={18} width={18} />}
                                            value={field.value}
                                            onChangeText={field.onChange}
                                            onBlur={field.onBlur}
                                            invalid={Boolean(errors.email)}
                                            />
                                        )}
                                    />
                                    <FieldError errors={getErrorMessages(errors.email)} />
                                </Field>
                            </FieldSet>

                            <View className="pt-6">
                                <Button
                                onPress={handleSubmit(handleSendEmail)}
                                disabled={isSending}
                                style={({ pressed }: { pressed: boolean }) => ({
                                    opacity: pressed ? 0.85 : isSending ? 0.7 : 1,
                                })}
                                >
                                    {isSending ? (
                                        <LoadingIndicator tone="inverse" />
                                    ) : (
                                        <Text className="text-white font-sans-semibold text-lg">
                                            Send Reset Link
                                        </Text>
                                    )}
                                </Button>
                            </View>

                            <Pressable
                            onPress={() => router.push('/login')}
                            className="items-center pt-4"
                            >
                                <Text className="text-primary font-sans-semibold text-base">
                                    Back to Login
                                </Text>
                            </Pressable>
                        </>
                    ) : (
                        <View className="items-center gap-3">
                            <View className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-secondary-blue-light px-4 py-3">
                                <Mail color="#0E33F3" height={16} width={16} />
                                <Text className="text-center font-sans-semibold text-primary text-base">
                                    {email}
                                </Text>
                            </View>

                            <Text className="text-center text-neutral-grey-1 text-base">
                                Did not receive the email?
                            </Text>

                            {isResendAllowed ? (
                                <Button
                                onPress={handleResend}
                                disabled={isResending}
                                >
                                    {isResending ? (
                                        <LoadingIndicator tone="inverse" />
                                    ) : (
                                        <Text className="text-white font-sans-semibold text-base">
                                            Resend Email
                                        </Text>
                                    )}
                                </Button>
                            ) : (
                                <Text className="text-neutral-grey-1 text-base">
                                    Resend in {resendTimer}s
                                </Text>
                            )}

                            <Pressable
                            onPress={() => router.push('/login')}
                            className="items-center pt-4"
                            >
                                <Text className="text-primary font-sans-semibold text-base">
                                    Back to Login
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>
        </AuthScreenShell>
    );
}
