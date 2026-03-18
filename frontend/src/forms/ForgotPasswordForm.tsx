import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { useForgotPasswordMutation } from "@/hooks/auth.hook"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const ForgotPasswordSchema = z.object({
    email: z.string().nonempty("Email is required")
})

export type forgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>

type ForgotPasswordFormProps = {
    handleChangeSendEmail: (data: forgotPasswordSchemaType) => void 
}

const ForgotPasswordForm = ({ handleChangeSendEmail }: ForgotPasswordFormProps) => {

    const {
        handleSubmit,
        control,
        setError
    } = useForm<forgotPasswordSchemaType>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: { email: "" },
        criteriaMode: "all"
    })
    const { mutateAsync, isPending } = useForgotPasswordMutation<forgotPasswordSchemaType>(setError)

    const onSubmit = async (data: { email: string }) => {
        await mutateAsync(data, { 
            onSuccess: () => handleChangeSendEmail(data)
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">

                    <FieldLabel htmlFor={field.name}>
                        Email
                    </FieldLabel>

                    <Input
                    id={field.name}
                    placeholder="Enter your email"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    />

                    {fieldState.invalid && (
                        <FieldError errors={getErrorMessages(fieldState.error)} />
                    )}

                </Field>
            )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Send Reset Link
                    </>
                )}
            </Button>

        </form>
    )
}

export default ForgotPasswordForm