import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import PasswordInput from "@/components/ui/passwordInput";
import { useChangePasswordMutation } from "@/hooks/auth.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const ChangePasswordSchema = z.object({
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

type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;

const ChangePasswordForm = () => {
    const {
        control,
        handleSubmit,
        reset,
        setError,
    } = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        criteriaMode: "all",
    });

    const { mutateAsync, isPending } = useChangePasswordMutation<ChangePasswordSchemaType>(setError);

    const onSubmit = async (data: ChangePasswordSchemaType) => {
        await mutateAsync(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
                name="currentPassword"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                        <PasswordInput
                            id={field.name}
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
                name="newPassword"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                        <PasswordInput
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            {...field}
                        />
                        <FieldDescription>Use a password different from your current one.</FieldDescription>
                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                        <PasswordInput
                            id={field.name}
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
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <KeyRound className="w-4 h-4" />
                            Update Password
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
