import AuthScreenShell from "@/components/auth/AuthScreenShell";
import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoginMutation } from "@/hooks/auth.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, type RelativePathString } from "expo-router";
import { CheckCircle2, LockKeyhole, Mail, UsersRound } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View
} from "react-native";
import { z } from "zod";

const LoginSchema = z.object({
    role: z.string().nonempty("Role is required"),
    email: z.string().email("Email is invalid").nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
});

export type loginSchema = z.infer<typeof LoginSchema>;

const forgotPasswordHref: RelativePathString = "./forgot-password";

export default function Login() {
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<loginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            role: "",
            email: "",
            password: "",
        },
        criteriaMode: "all",
    });

    const { mutateAsync, isPending } = useLoginMutation<loginSchema>(setError);
    const router = useRouter();

    const onSubmit = async (data: loginSchema) => {
        try {
            const { role: _role, ...payload } = data;
            await mutateAsync(payload);
            router.replace('/redirecting');
        } catch {
            return;
        }
    };

    return (
        <AuthScreenShell
            cue="System check - All operational"
            cueIcon={<CheckCircle2 color="#014D40" height={12} width={12} />}
            cueTone="success"
            title="Welcome back"
            subtitle="Sign in to continue your staff workspace."
        >
                <View className="gap-5">
                    <FieldSet className="gap-3">
                        <Field className="gap-1">
                            <FieldLabel className="text-base">Staff Role</FieldLabel>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        placeholder="Select role"
                                        surface="white"
                                        invalid={Boolean(errors.role)}
                                    >
                                        <SelectTrigger
                                            leftIcon={<UsersRound color="#6B7580" height={18} width={18} />}
                                        >
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="RESORT_STAFF">Resort Staff</SelectItem>
                                            <SelectItem value="KITCHEN_STAFF">Kitchen Staff</SelectItem>
                                            <SelectItem value="MAINTENANCE_STAFF">Maintenance Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={getErrorMessages(errors.role)} />
                        </Field>

                        <Field className="gap-1">
                            <FieldLabel className="text-base">Email</FieldLabel>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                    keyboardType="email-address"
                                    textContentType="none"
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

                            <Field>
                                <FieldLabel className="text-base">Password</FieldLabel>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <PasswordInput
                                        textContentType="none"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="Password"
                                        returnKeyType="done"
                                        surface="white"
                                        leftIcon={<LockKeyhole color="#6B7580" height={18} width={18} />}
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                        invalid={Boolean(errors.password)}
                                    />
                                )}
                            />
                            <FieldError errors={getErrorMessages(errors.password)} />
                            <FieldError errors={getErrorMessages(errors.root)} />


                            <View className="items-end">
                                <Pressable
                                onPress={() => router.push(forgotPasswordHref)}
                                className="py-1"
                                >
                                    <Text className="text-primary font-sans-semibold text-base">
                                        Forgot password?
                                    </Text>
                                </Pressable>
                            </View>
                            
                        </Field>
                    </FieldSet>

                    <View className="pt-8">
                        <Button
                        onPress={handleSubmit(onSubmit)}
                        disabled={isPending}
                        style={({ pressed }: { pressed: boolean }) => ({
                            opacity: pressed ? 0.85 : isPending ? 0.7 : 1,
                        })}
                        >
                            {isPending ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text className="text-white font-sans-semibold text-lg">
                                    Login
                                </Text>
                            )}
                        </Button>
                    </View>
                </View>
        </AuthScreenShell>
    );
}
