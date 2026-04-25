export const getPaginationMeta  = (total: number, page: number, limit: number) => {
    const totalPages = Math.ceil(total / limit);
    
    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }
}

export const getPaginationArgs = (page: number, limit: number) => {
    return {
        skip: (page - 1) * limit,
        take: limit
    }
}