
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
}