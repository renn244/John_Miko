import type { PaginationParams } from "@/types/pagination.type";

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

export type CreateMenuItemDto = {
    imageUrl: MenuItem['imageUrl'];
    name: MenuItem['name'];
    description: MenuItem['description'];
    category: MenuItem['category'];
    price: MenuItem['price'];
    availability: MenuItem['availability']
}

export type UpdateMenuItemDto = Partial<CreateMenuItemDto>;

export type getMenuItemsQuery = {
    search?: string;
    category?: MenuItem['category'];
    availability?: MenuItem['availability'];
} & PaginationParams

export type MenuItemStats = {
    total: number;
    available: number;
    unavailable: number;
}
