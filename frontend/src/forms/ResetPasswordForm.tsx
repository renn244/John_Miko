import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import PasswordInput from "@/components/ui/passwordInput"
import { useResetPasswordMutation } from "@/hooks/auth.hook"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const passwordRules = [
    { test: (v: string) => v.length >= 8, label: "At least 8 characters" },
    { test: (v: string) => /[a-z]/.test(v), label: "Lowercase letter" },
    { test: (v: string) => /[A-Z]/.test(v), label: "Uppercase letter" },
    { test: (v: string) => /\d/.test(v), label: "Number" },
    { test: (v: string) => /[^A-Za-z0-9]/.test(v), label: "Special character" },
]

const ResetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/\d/, "Password must contain a number")
        .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
})

type resetPasswordSchema = z.infer<typeof ResetPasswordSchema>

type ResetPasswordFormProps = {
    token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
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
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
            />

            <Button type="submit" className="w-full">
                {isPending ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        Reset Password
                    </>
                )}
            </Button>
        </form>
    )
}

export default ResetPasswordForm