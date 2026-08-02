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
            <div aria-live="polite">
                <p className="text-sm font-semibold text-foreground">
                    {showAdminLogin ? "Administrator account" : "Guest account"}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {showAdminLogin
                        ? "Sign in to manage resort operations and guest services."
                        : "Sign in to manage your bookings, settings, and guest details."}
                </p>

                <div
                    id="admin-login-context"
                    aria-hidden={!showAdminLogin}
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                        showAdminLogin ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                    <div className="overflow-hidden">
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                            Administrative access is reserved for resort staff.
                        </p>
                    </div>
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
                className="font-medium text-primary hover:underline underline-offset-2"
                >
                    Forgot Password?
                </Link>
            </div>

            <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? (
                    <LoadingSpinner />
                ) : (
                    "Sign in"
                )}
            </Button>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                aria-controls="admin-login-context"
                aria-expanded={showAdminLogin}
                onClick={handleAdminLoginToggle}
            >
                {showAdminLogin ? "Switch to guest" : "Switch to admin"}
            </Button>
        </form>
    )
}

export default LoginForm
