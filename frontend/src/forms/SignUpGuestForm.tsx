import { useSignUpGuestMutation } from "@/api/auth/auth.mutation";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import PasswordInput from "@/components/ui/passwordInput";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
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
                        Name
                    </FieldLabel>

                    <Input
                    id={field.name}
                    placeholder="Enter your name"
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

            <Controller 
            name="contactNo"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">

                    <FieldLabel htmlFor={field.name}>
                        Contact No.
                    </FieldLabel>

                    <Input
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="text"
                    inputMode="numeric"
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

            <Button type="submit" className="w-full">
                {isPending ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <UserPlus className="w-5 h-5" />
                        Sign Up
                    </>
                )}
            </Button>
        </form>
    )
}

export default SignUpGuestForm