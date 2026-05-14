import Logo from "@/assets/app/logo/logo.svg";
import { Button } from "@/components/ui/Button";
import CustomSafeArea from "@/components/ui/CustomSafeAreaView";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    useForgotPasswordMutation,
    useResendForgotPasswordMutation
} from "@/hooks/auth.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
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
                            Forgot Password
                        </Text>
                        <Text className="text-center text-neutral-grey-1 text-base">
                            Enter your email to receive reset instructions.
                        </Text>
                    </View>

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
                                        <ActivityIndicator color="#FFFFFF" />
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
                            <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                                Check your email
                            </Text>
                            <Text className="text-center text-neutral-grey-1 text-base">
                                Reset instructions were sent to
                            </Text>
                            <Text className="font-sans-semibold text-primary text-base">
                                {email}
                            </Text>

                            <Text className="text-center text-neutral-grey-1 text-base">
                                Did not receive the email?
                            </Text>

                            {isResendAllowed ? (
                                <Button
                                variant="secondary"
                                onPress={handleResend}
                                disabled={isResending}
                                >
                                    {isResending ? (
                                        <ActivityIndicator color="#1F2933" />
                                    ) : (
                                        <Text className="text-neutral-dark-1 font-sans-semibold text-base">
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
            </KeyboardAwareScrollView>
        </CustomSafeArea>
    );
}
