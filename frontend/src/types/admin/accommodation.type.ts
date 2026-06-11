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
    stayOptions: AccommodationStayOption[];

    createdAt: string;
    updatedAt: string;
}

export type AccommodationStayOption = {
    id: string;
    accommodationId: string;
    code: string;
    label: string;
    durationHours?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    sortOrder: number;
    isActive: boolean;
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
    stayOptions: Array<{
        code: AccommodationStayOption['code'];
        label: AccommodationStayOption['label'];
        durationHours?: AccommodationStayOption['durationHours'];
        startTime?: AccommodationStayOption['startTime'];
        endTime?: AccommodationStayOption['endTime'];
        sortOrder: AccommodationStayOption['sortOrder'];
        isActive: AccommodationStayOption['isActive'];
    }>;
}

export type UpdateAccommodationDto = Omit<CreateAccommodationDto, "stayOptions">;

export type GetAccommodationQuery = {
    type?: Accommodation['type'];
    search?: string;
} & PaginationParams

// Response types
export type AccommodationStats = {
    total: number;
    room?: number;
    cottage?: number;
    eventhall?: number;
}

export type AccommodationOption = {
    id: string;
    name: string;
}
