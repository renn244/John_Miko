
export type PaginationParams = {
    page?: number;
    limit?: number;
}

export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export type PaginatedResponse<T> = {
    data: T[];
    meta: PaginationMeta;
}