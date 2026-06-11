import z from "zod";

export const StayOptionSchema = z.object({
    code: z.string(),
    label: z.string().nonempty("Stay option label is required"),
    durationHours: z.number().min(1, "Duration must be at least 1 hour").optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    sortOrder: z.number(),
    isActive: z.boolean(),
});

export const AccommodationSchema = z.object({
    name: z.string().nonempty("Name is required"),
    type: z.enum(["Room", "Cottage", "EventHall"]).nonoptional("Type is required"),
    capacity: z.number().nonnegative("Capicity must be a positive number").int("Capicity must be an integer").min(1, "Capacity must be at least 1"),
    price: z.number().nonnegative("Price must be a positive number").min(1, "Price must be at least 1"),
    description: z.string().nonempty("Description is required"),
    imageUrl: z.url().nonempty("Image URL is required"),
    amenities: z.array(z.string()),
    stayOptions: z.array(StayOptionSchema).min(1, "At least one stay option is required"),
});

export type AccommodationFormValues = z.infer<typeof AccommodationSchema>;
