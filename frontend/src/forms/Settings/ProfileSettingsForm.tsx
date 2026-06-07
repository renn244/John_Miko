import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useUpdateProfileMutation } from "@/hooks/auth.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import type { UserProfileDto } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { useEffect } from "react";
import z from "zod";

const ProfileSettingsSchema = z.object({
    name: z.string().trim().nonempty("Name is required"),
    email: z.string().trim().nonempty("Email is required"),
    contactNo: z.string().trim().nonempty("Contact number is required"),
});

type ProfileSettingsSchemaType = z.infer<typeof ProfileSettingsSchema>;

type ProfileSettingsFormProps = {
    user: UserProfileDto;
}

const ProfileSettingsForm = ({ user }: ProfileSettingsFormProps) => {
    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { isDirty },
    } = useForm<ProfileSettingsSchemaType>({
        resolver: zodResolver(ProfileSettingsSchema),
        defaultValues: {
            name: user.name ?? "",
            email: user.email,
            contactNo: user.contactNo,
        },
        criteriaMode: "all",
    });

    useEffect(() => {
        reset({
            name: user.name ?? "",
            email: user.email,
            contactNo: user.contactNo,
        });
    }, [reset, user.contactNo, user.email, user.name]);

    const { mutateAsync, isPending } = useUpdateProfileMutation<ProfileSettingsSchemaType>(setError);

    const onSubmit = async (data: ProfileSettingsSchemaType) => {
        await mutateAsync(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                            id={field.name}
                            placeholder="Enter your full name"
                            aria-invalid={fieldState.invalid}
                            {...field}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                            id={field.name}
                            type="email"
                            placeholder="your@email.com"
                            aria-invalid={fieldState.invalid}
                            {...field}
                        />
                        <FieldDescription>This email will be used for account access and booking updates.</FieldDescription>
                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="contactNo"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                        <Input
                            id={field.name}
                            placeholder="09XXXXXXXXX"
                            aria-invalid={fieldState.invalid}
                            {...field}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
            />

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending || !isDirty}>
                    {isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ProfileSettingsForm;
