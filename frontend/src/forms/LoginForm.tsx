import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import PasswordInput from "@/components/ui/passwordInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLoginMutation } from "@/hooks/auth.hook"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, LogIn, User } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"
import z from "zod"

const LoginSchema = z.object({
    userRole: z.enum(['guest', 'staff', 'admin']),
    email: z.string()
        .nonempty('Email is required'),
    password: z.string()
        .nonempty('Password is required'),
    rememberMe: z.boolean().optional(),
})

type loginSchema = z.infer<typeof LoginSchema>

const LoginForm = () => {
    const {
        handleSubmit,
        control,
        setError,
    } = useForm<loginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            userRole: "guest",
            email: "",
            password: "",
            rememberMe: false,
        },
        criteriaMode: "all"
    })

    const { mutateAsync, isPending } = useLoginMutation<loginSchema>(setError)
    
    const onSubmit = async (data: loginSchema) => {
        await mutateAsync(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
            <Controller
            name="userRole"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                    <FieldLabel htmlFor={field.name}>Login As</FieldLabel>

                    <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    >
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                            <SelectValue placeholder="Select user type" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="guest">
                                <User className="w-4 h-4" style={{ color: "#1E73BE" }} />
                                Guest
                            </SelectItem>

                            <SelectItem value="admin">
                                <Lock className="w-4 h-4" style={{ color: "#1E73BE" }} />
                                Administrator
                            </SelectItem>
                        </SelectContent>
                    </Select>

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
                    <>
                        <LogIn className="w-5 h-5" />
                        Sign In
                    </>
                )}
            </Button>
        </form>
    )
}

export default LoginForm