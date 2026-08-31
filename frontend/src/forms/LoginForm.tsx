import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import PasswordInput from "@/components/ui/passwordInput"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useLoginMutation } from "@/hooks/auth.hook"
import { getErrorMessages } from "@/lib/getErrorMessages"
import type { UserRole } from "@/types/auth.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch, type FieldError as HookFormFieldError } from "react-hook-form"
import { Link } from "react-router"
import z from "zod"

const LoginSchema = z.object({
    userRole: z.enum(['GUEST', 'ADMIN', 'MAINTENANCE_STAFF', 'KITCHEN_STAFF', 'RESORT_STAFF']),
    email: z.string()
        .nonempty('Email is required'),
    password: z.string()
        .nonempty('Password is required'),
    rememberMe: z.boolean().optional(),
})

type LoginSchemaType = z.infer<typeof LoginSchema>

type LoginFormMode = "guest" | "internal";

type LoginFormProps = {
    mode: LoginFormMode;
    showAccountContext?: boolean;
};

const INTERNAL_LOGIN_ROLES: readonly Exclude<UserRole, "GUEST">[] = [
    "ADMIN",
    "MAINTENANCE_STAFF",
    "KITCHEN_STAFF",
    "RESORT_STAFF",
];

const LOGIN_CONTEXT = {
    GUEST: {
        label: "Guest account",
        description: "Sign in to manage your bookings, settings, and guest details.",
    },
    ADMIN: {
        label: "Administrator account",
        description: "Sign in to manage resort operations and guest services.",
    },
    MAINTENANCE_STAFF: {
        label: "Maintenance staff account",
        description: "Sign in to view and manage maintenance work assigned to you.",
    },
    KITCHEN_STAFF: {
        label: "Kitchen staff account",
        description: "Sign in to prepare and manage guest meal pre-orders.",
    },
    RESORT_STAFF: {
        label: "Resort staff account",
        description: "Sign in to prepare confirmed bookings and submit staff reports.",
    },
} as const;

const LoginForm = ({ mode, showAccountContext = true }: LoginFormProps) => {
    const isGuestLogin = mode === "guest";
    const {
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            userRole: isGuestLogin ? "GUEST" : "ADMIN",
            email: "",
            password: "",
            rememberMe: false,
        },
        criteriaMode: "all"
    })

    const selectedRole = useWatch({ control, name: "userRole" });
    const context = LOGIN_CONTEXT[selectedRole];
    const { mutateAsync, isPending } = useLoginMutation<LoginSchemaType>(setError)
    const rootError = errors.root as HookFormFieldError | undefined;
    
    const onSubmit = async (data: LoginSchemaType) => {
        try {
            await mutateAsync(data)
        } catch {
            return
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isGuestLogin ? (
                <Controller
                    name="userRole"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor={field.name}>Sign in as</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id={field.name} className="h-11 w-full" aria-invalid={fieldState.invalid}>
                                    <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INTERNAL_LOGIN_ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {LOGIN_CONTEXT[role].label.replace(" account", "")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                />
            ) : null}

            {showAccountContext ? (
                <div aria-live="polite">
                    <p className="text-sm font-semibold text-foreground">
                        {context.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {context.description}
                    </p>
                </div>
            ) : null}

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
                className="whitespace-nowrap font-medium text-primary hover:underline underline-offset-2"
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
        </form>
    )
}

export default LoginForm
