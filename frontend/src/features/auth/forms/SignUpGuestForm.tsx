import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import PasswordInput from "@/components/ui/passwordInput";
import { useSignUpGuestMutation } from "@/features/auth/hooks/auth.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const SignUpGuestSchema = z.object({
    email: z.string()
        .nonempty("Email is required"),
    name: z.string()
        .nonempty("Name is required"),
    contactNo: z.string()
        .nonempty("Contact No. is required"),
    password: z.string()
        .nonempty("Password is required"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"]
})

type signUpGuestSchema = z.infer<typeof SignUpGuestSchema>

const SignUpGuestForm = () => {
    const {
        handleSubmit,
        control,
        setError
    } = useForm<signUpGuestSchema>({
        resolver:  zodResolver(SignUpGuestSchema),
        defaultValues: {
            email: "",
            name: "",
            contactNo: "",
            password: "",
            confirmPassword: ""
        },
        criteriaMode: "all"
    })

    const { mutateAsync, isPending } = useSignUpGuestMutation(setError)

    const onSubmit = async (data: signUpGuestSchema) => {
        await mutateAsync(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <Controller 
            name="name"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">

                    <FieldLabel htmlFor={field.name}>
                        Full Name
                    </FieldLabel>

                    <Input
                    id={field.name}
                    placeholder="e.g. Jane Doe"
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

                    <FieldLabel htmlFor={field.name}>
                        Email
                    </FieldLabel>

                    <Input
                    id={field.name}
                    placeholder="jane@example.com"
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
            name="contactNo"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">

                    <FieldLabel htmlFor={field.name}>
                        Contact Number
                    </FieldLabel>

                    <Input
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="+63 912 345 6789"
                    type="text"
                    {...field}
                    />

                    {fieldState.invalid && (
                        <FieldError errors={getErrorMessages(fieldState.error)} />
                    )}

                </Field>
            )}
            />
            
            <Controller 
            name="password"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">

                    <FieldLabel htmlFor={field.name}>
                        Password
                    </FieldLabel>

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
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">

                    <FieldLabel htmlFor={field.name}>
                        Confirm Password
                    </FieldLabel>

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

            <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? (
                    <LoadingSpinner />
                ) : (
                    "Create Account"
                )}
            </Button>
        </form>
    )
}

export default SignUpGuestForm
