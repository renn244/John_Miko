import z from "zod";

const guestCountSchema = z.number().int().min(0, "Guest count cannot be negative");
const quantitySchema = z.number().int().min(1, "Quantity must be at least 1");

const addOnSelectionSchema = z.object({
    addOnServiceId: z.string().nonempty(),
    quantity: quantitySchema,
    name: z.string(),
    price: z.number().min(0),
    imageUrl: z.string().optional(),
});

const preOrderSelectionSchema = z.object({
    menuItemId: z.string().nonempty(),
    quantity: quantitySchema,
    name: z.string(),
    price: z.number().min(0),
    imageUrl: z.string().optional(),
});

export const ManualBookingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email().nonempty("Email is required"),
    contactNo: z.string().nonempty("Contact number is required").regex(/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits"),
    adultGuests: guestCountSchema,
    seniorGuests: guestCountSchema,
    kidGuests: guestCountSchema,
    specialRequest: z.string().optional(),
    proofImageUrl: z.url().or(z.literal("")).optional(),
    accommodationId: z.string().nonempty("Accommodation is required"),
    checkIn: z.date().nonoptional("Check-in date is required"),
    stayOptionId: z.string().nonempty("Stay option is required"),
    addOnServices: z.array(addOnSelectionSchema),
    preOrderItems: z.array(preOrderSelectionSchema),
    paymentType: z.enum(["Partial", "Full"]).nonoptional("Payment type is required"),
}).superRefine((data, context) => {
    if (data.adultGuests + data.seniorGuests + data.kidGuests < 1) {
        context.addIssue({
            code: "custom",
            path: ["adultGuests"],
            message: "At least one guest is required",
        });
    }
});

export type ManualBookingFormValues = z.infer<typeof ManualBookingSchema>;
