import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import PasswordInput from "@/components/ui/passwordInput"
import { accountPasswordSchema, passwordRules } from "@/features/auth/lib/passwordValidation"
import { useResetPasswordMutation } from "@/features/auth/hooks/auth.hook"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const ResetPasswordSchema = z.object({
    token: z.string(),
    newPassword: accountPasswordSchema,
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
})

type resetPasswordSchema = z.infer<typeof ResetPasswordSchema>

type ResetPasswordFormProps = {
    token: string;
    onSuccess?: () => void;
}

const ResetPasswordForm = ({ token, onSuccess }: ResetPasswordFormProps) => {
    const {
        handleSubmit,
        control,
        setError
    } = useForm<resetPasswordSchema>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            token: token,
            newPassword: "",
            confirmPassword: ""
        },
        criteriaMode: "all",
    })

    const { mutateAsync, isPending } = useResetPasswordMutation<resetPasswordSchema>(setError)

    const onSubmit = async (data: resetPasswordSchema) => {
        await mutateAsync(data)
        onSuccess && onSuccess()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Controller 
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => {
                return (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                        
                        <PasswordInput 
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        {...field}
                        />
                        <FieldDescription>Use a different password from your previous one.</FieldDescription>

                        {fieldState.invalid ? (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        ) : (
                            <ul className="text-sm font-normal text-muted-foreground ml-4 flex list-disc flex-col gap-1">
                                {passwordRules
                                .filter((rule) => !rule.test(field.value))
                                .map((rule) => (
                                    <li key={rule.label} className="text-muted-foreground">
                                        {rule.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Field>
                )
            }}
            />

            <Controller 
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>

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

            <Button type="submit" className="w-full">
                {isPending ? (
                    <LoadingSpinner />
                ) : (
                    "Reset Password"
                )}
            </Button>
        </form>
    )
}

export default ResetPasswordForm
