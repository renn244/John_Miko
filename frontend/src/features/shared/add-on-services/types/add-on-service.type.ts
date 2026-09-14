export type AddOnService = {
    id: string;
    imageUrl: string;
    name: string;
    description?: string | null;
    price: number;
    quantity: number;
    isActive: boolean;
    createdAt: string;
}

export type CreateAddOnServiceDto = {
    imageUrl: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
}

export type UpdateAddOnServiceDto = CreateAddOnServiceDto

export type UpdateAddOnServiceAvailabilityDto = {
    isActive: boolean;
}

export type GetAddOnServicesQuery = {
    search?: string;
    page?: number;
    limit?: number;
}

export type AddOnServiceStats = {
    totalServices: number;
    totalStocks: number;
    totalValue: number;
}
