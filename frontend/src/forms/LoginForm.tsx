import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import PasswordInput from "@/components/ui/passwordInput"
import { useLoginMutation } from "@/hooks/auth.hook"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm, type FieldError as HookFormFieldError } from "react-hook-form"
import { Link } from "react-router"
import z from "zod"

const LoginSchema = z.object({
    userRole: z.enum(['GUEST', 'ADMIN']),
    email: z.string()
        .nonempty('Email is required'),
    password: z.string()
        .nonempty('Password is required'),
    rememberMe: z.boolean().optional(),
})

type loginSchema = z.infer<typeof LoginSchema>

const LoginForm = () => {
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const {
        handleSubmit,
        control,
        setError,
        setValue,
        formState: { errors },
    } = useForm<loginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            userRole: "GUEST",
            email: "",
            password: "",
            rememberMe: false,
        },
        criteriaMode: "all"
    })

    const { mutateAsync, isPending } = useLoginMutation<loginSchema>(setError)
    const rootError = errors.root as HookFormFieldError | undefined;
    
    const onSubmit = async (data: loginSchema) => {
        try {
            await mutateAsync(data)
        } catch {
            return
        }
    }

    const handleAdminLoginToggle = () => {
        const nextValue = !showAdminLogin;
        setShowAdminLogin(nextValue);
        setValue("userRole", nextValue ? "ADMIN" : "GUEST", {
            shouldDirty: true,
            shouldValidate: true,
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-lg border bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            {showAdminLogin ? "Admin Login" : "Guest Login"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {showAdminLogin
                                ? "Use your administrator account credentials."
                                : "Use your guest account credentials."}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAdminLoginToggle}
                    >
                        {showAdminLogin ? "Use Guest" : "Use Admin"}
                    </Button>
                </div>
            </div>

            <Controller 
            name="email"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                    <Input
                    id={field.name}
                    placeholder="your@email.com"
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
            name="password"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                    <PasswordInput
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        {...field}
                        />

                    {fieldState.invalid && (
                        <FieldError errors={getErrorMessages(fieldState.error)} />
                    )}

                    <FieldError errors={getErrorMessages(rootError)} />
                </Field>
            )}
            />

            <div className="flex items-center justify-between text-sm">
                <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                    <Field orientation="horizontal" className="max-w-62.5">
                        <Checkbox
                            id={field.name}
                                checked={field.value}
                                onCheckedChange={(v) =>
                                field.onChange(v === "indeterminate" ? false : v)
                            }
                        />
                        <FieldLabel htmlFor={field.name}>Remember me</FieldLabel>
                    </Field>
                )}
                />

                <Link
                to="/forgot-password"
                className="text-blue-600 font-medium hover:underline underline-offset-2"
                >
                    Forgot Password?
                </Link>
            </div>

            <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? (
                    <LoadingSpinner />
                ) : (
                    "Sign In"
                )}
            </Button>
        </form>
    )
}

export default LoginForm
