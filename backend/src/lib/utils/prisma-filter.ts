export function cleanPrismaWhere<T extends Record<string, any>>(query: T) {
    return Object.fromEntries(
        Object.entries(query ?? {}).filter(
            ([, value]) => value !== undefined && value !== null && value !== '',
        ),
    );
}