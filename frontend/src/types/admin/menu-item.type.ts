
export type MenuItem = {
    id: string;
    imageUrl: string;
    name: string;
    description: string;

    category: string;
    price: number;
    availability: "Available" | "Unavailable";

    createdAt: string;
}