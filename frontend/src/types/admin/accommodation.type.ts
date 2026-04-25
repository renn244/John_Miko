import type { PaginationParams } from "../pagination.type";

export type Accommodation = {
    id: string;
    name: string;
    description: string;
    imageUrl: string; // replace with images
    
    type: "Room" | "Cottage" | "EventHall";
    capacity: number;
    price: number;
    
    amenities: string[];
    availability: "Available" | "Unavailable" | "Maintenance";

    createdAt: string;
    updatedAt: string;
}

export type CreateAccommodationDto = {
    name: Accommodation['name'];
    description: Accommodation['description'];
    imageUrl: Accommodation['imageUrl'];

    type: Accommodation['type'];
    capacity: Accommodation['capacity'];
    price: Accommodation['price'];
    
    amenities: Accommodation['amenities'];
    availability: Accommodation['availability'];
}

export type UpdateAccommodationDto = CreateAccommodationDto;

export type GetAccommodationQuery = {
    type?: Accommodation['type'];
    availability?: Accommodation['availability'];
    search?: string;
} & PaginationParams

// Response types
export type AccommodationStats = {
    total: number;
    available: number;
    unavailable: number;
    maintenance: number;
}

export type AccommodationOption = {
    id: string;
    name: string;
}