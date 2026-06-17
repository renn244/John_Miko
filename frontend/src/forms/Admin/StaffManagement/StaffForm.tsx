import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StaffRole } from "@/types/admin/staff-management.type";
import { useViewportFitHeight } from "@/hooks/common/useViewportFitHeight";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, type ComponentProps } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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

type staffSchema = z.infer<typeof StaffSchema>

type StaffFormProps = {
    onsubmit: (data: staffSchema) => Promise<void>;
    oncancel: () => void;
    className?: string;
    fitHeight?: boolean;
} & ComponentProps<"form">;

const StaffForm = ({ onsubmit, oncancel, className, fitHeight = false, ...props }: StaffFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        setError,
        watch,
    } = useForm<staffSchema>({
        resolver: zodResolver(StaffSchema),
        defaultValues: {
            name: "",
            email: "",
            contactNo: "",
            role: "KITCHEN_STAFF",
            expertise: undefined,
        },
        criteriaMode: "all",
    })
    const selectedRole = watch("role") as StaffRole;

    const formRef = useRef<HTMLFormElement | null>(null);
    const formHeight = useViewportFitHeight(formRef, {
        enabled: fitHeight,
        containerSelector: 'main'
    });

    const { style: styleProp, ...formProps } = props;

    const onSubmit = async (data: staffSchema) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return
            }

            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        className={cn("bg-white rounded-xl shadow-sm border-2 overflow-hidden flex flex-col", className)}
        style={{
            ...styleProp,
            ...(fitHeight && formHeight ? { height: formHeight } : null),
        }}
        {...formProps}
        >
            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-auto">
                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Basic Information
                    </h2>
                    <div className="space-y-5">

                        <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
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

                        <div className="grid md:grid-cols-2 gap-5">
                            <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
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
                                <Field data-invalid={fieldState.invalid}>
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

                        <div className="grid md:grid-cols-2 justify-between gap-5">
                            <Controller
                            name="role"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
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

                            {selectedRole === "MAINTENANCE_STAFF" && (
                                <Controller
                                name="expertise"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
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
                                        {fieldState.invalid && (
                                            <FieldError errors={getErrorMessages(fieldState.error)} />
                                        )}
                                    </Field>
                                )}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button type="button" variant="outline" disabled={isLoading} onClick={oncancel}>
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type="submit">
                        {isLoading ? <LoadingSpinner /> : "Create Staff"}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default StaffForm
