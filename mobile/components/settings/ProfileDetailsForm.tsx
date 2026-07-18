import { Button } from "@/components/ui/Button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import OperationalCard from "@/components/ui/operational-card";
import { useUpdateProfileMutation } from "@/hooks/profile.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import type { ProfileResponse } from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, UserRound } from "lucide-react-native";
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

  const { mutate: updateProfile, isPending: isSavingProfile } =
    useUpdateProfileMutation<ProfileFormValues>(setError);

  useEffect(() => {
    reset({
      name: user.name ?? "",
      email: user.email ?? "",
      contactNo: user.contactNo ?? "",
    });
  }, [reset, user]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    updateProfile(data);
  };

  return (
    <OperationalCard contentClassName="gap-5 px-5 py-5">
      <View className="gap-1">
        <Text className="font-sans-bold text-xl text-neutral-dark-1">
          Profile details
        </Text>
        <Text className="text-base text-neutral-grey-1">
          Manage your personal information.
        </Text>
      </View>

      <View className="gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="gap-1">
              <FieldLabel className="text-base">Full Name</FieldLabel>
              <Input
                placeholder="Your full name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                invalid={Boolean(fieldState.error)}
                surface="white"
                leftIcon={<UserRound size={18} color="#6B7580" />}
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
              <FieldLabel className="text-base">Email Address</FieldLabel>
              <Input
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                invalid={Boolean(fieldState.error)}
                surface="white"
                leftIcon={<Mail size={18} color="#6B7580" />}
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
                surface="white"
                leftIcon={<Phone size={18} color="#6B7580" />}
              />
              <FieldError errors={getErrorMessages(fieldState.error)} />
            </Field>
          )}
        />

        <Button
          onPress={handleSubmit(onProfileSubmit)}
          disabled={isSavingProfile || !isDirty}
          className="rounded-md"
        >
          {isSavingProfile ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-sans-semibold text-base text-white">
              Save Changes
            </Text>
          )}
        </Button>
      </View>
    </OperationalCard>
  );
};

export default ProfileDetailsForm;
