import { Button } from "@/components/ui/Button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateProfileMutation } from "@/hooks/profile.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import type { ProfileResponse } from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().trim().nonempty("Name is required"),
    email: z.string().email("Email is required").nonempty("Email is required"),
    contactNo: z.string().trim().nonempty("Contact number is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileDetailsFormProps = {
    user: ProfileResponse;
};

const ProfileDetailsForm = ({ user }: ProfileDetailsFormProps) => {
    const {
        control,
        handleSubmit,
        setError,
        formState: { isDirty },
        reset,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name ?? "",
            email: user.email ?? "",
            contactNo: user.contactNo ?? "",
        },
        criteriaMode: "all",
    });

    const { mutateAsync: updateProfile, isPending: isSavingProfile } =
        useUpdateProfileMutation<ProfileFormValues>(setError);

    useEffect(() => {
        reset({
            name: user.name ?? "",
            email: user.email ?? "",
            contactNo: user.contactNo ?? "",
        });
    }, [reset, user]);

    const onProfileSubmit = async (data: ProfileFormValues) => {
        await updateProfile(data);
    };

    return (
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
                    control={control}
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
                    control={control}
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
                    control={control}
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
                    onPress={handleSubmit(onProfileSubmit)}
                    disabled={isSavingProfile || !isDirty}
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
    );
};

export default ProfileDetailsForm;
