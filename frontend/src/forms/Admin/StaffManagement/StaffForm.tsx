import FormSection from "@/components/common/FormSection";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import StaffPreviewCard from "./StaffPreviewCard";
import z from "zod";

const StaffSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    contactNo: z.string().nonempty("Contact number is required"),
    role: z.enum(["KITCHEN_STAFF", "RESORT_STAFF", "MAINTENANCE_STAFF"], { message: "Role is required" }),
    expertise: z.enum(["Electrical", "Pool", "Construction"]).optional(),
}).superRefine((value, ctx) => {
    if (value.role === "MAINTENANCE_STAFF" && !value.expertise) {
        ctx.addIssue({
            code: "custom",
            path: ["expertise"],
            message: "Expertise is required for maintenance staff",
        });
    }
});

type StaffSchemaType = z.infer<typeof StaffSchema>;

type StaffFormProps = {
    onsubmit: (data: StaffSchemaType) => Promise<void>;
    oncancel: () => void;
    className?: string;
} & ComponentProps<"form">;

const StaffForm = ({ onsubmit, oncancel, className, ...props }: StaffFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        setError,
    } = useForm<StaffSchemaType>({
        resolver: zodResolver(StaffSchema),
        defaultValues: {
            name: "",
            email: "",
            contactNo: "",
            role: "KITCHEN_STAFF",
            expertise: undefined,
        },
        criteriaMode: "all",
    });
    const watchedRole = useWatch({ control, name: "role" });

    const onSubmit = async (data: StaffSchemaType) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return;
            }

            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]", className)}
        {...props}
        >
            <div className="space-y-5">
                <FormSection title="Basic Information" contentClassName="space-y-5">
                        <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>
                                    Full Name <span className="text-red-700">*</span>
                                </FieldLabel>
                                <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g., Maria Santos"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        <div className="grid gap-5 md:grid-cols-2">
                            <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLabel htmlFor={field.name}>
                                        Email Address <span className="text-red-700">*</span>
                                    </FieldLabel>
                                    <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., maria@johnmikos.com"
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
                                        Contact Number <span className="text-red-700">*</span>
                                    </FieldLabel>
                                    <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., 09171234567"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                                )}
                            />
                        </div>
                </FormSection>

                <FormSection title="Role Assignment" contentClassName="grid gap-5 md:grid-cols-2">
                        <Controller
                        name="role"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>
                                    Role <span className="text-red-700">*</span>
                                </FieldLabel>
                                <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                >
                                    <SelectTrigger id={field.name}>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Staff Role</SelectLabel>
                                            <SelectItem value="KITCHEN_STAFF">Kitchen Staff</SelectItem>
                                            <SelectItem value="RESORT_STAFF">Resort Staff</SelectItem>
                                            <SelectItem value="MAINTENANCE_STAFF">Maintenance Staff</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        {watchedRole === "MAINTENANCE_STAFF" ? (
                            <Controller
                            name="expertise"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLabel htmlFor={field.name}>
                                        Expertise <span className="text-red-700">*</span>
                                    </FieldLabel>
                                    <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id={field.name}>
                                            <SelectValue placeholder="Select expertise" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Maintenance Expertise</SelectLabel>
                                                <SelectItem value="Electrical">Electrical</SelectItem>
                                                <SelectItem value="Pool">Pool</SelectItem>
                                                <SelectItem value="Construction">Construction</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid ? (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    ) : (
                                        <FieldDescription>
                                            This helps categorize maintenance staff by their strongest assignment area.
                                        </FieldDescription>
                                    )}
                                </Field>
                            )}
                            />
                        ) : (
                            <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-4">
                                <p className="text-sm font-medium text-foreground">No expertise required</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Expertise is only needed when the selected role is Maintenance Staff.
                                </p>
                            </div>
                        )}
                </FormSection>
            </div>

            <StaffPreviewCard
            control={control}
            isLoading={isLoading}
            oncancel={oncancel}
            />
        </form>
    );
};

export default StaffForm;
