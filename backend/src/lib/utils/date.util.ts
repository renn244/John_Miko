
export const toDateOnly = (input: Date | string): Date => {
    const date = new Date(input);
    
    date.setUTCHours(0, 0, 0, 0); 
    return date; 
};

/**
 * This is used mainly for analytics date range
 * 
 * @param interval 
 * @returns 
 * 
 * This function calculates the date range (gte and lte) based on the provided interval ('day', 'week', 'month', 'year').
 */
export const getDateRange = (interval: 'day' | 'week' | 'month' | 'year'): { lte: Date, gte: Date } => {
    const now = new Date();
    let gte: Date, lte: Date;

    const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOf   = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    switch (interval) {
        case 'day':
            gte = startOf(now);
            lte = endOf(now);
            break;

        case 'week':
            gte = startOf(new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()));
            lte = endOf(new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay())));
            break;

        case 'month':
            gte = startOf(new Date(now.getFullYear(), now.getMonth(), 1));
            lte = endOf(new Date(now.getFullYear(), now.getMonth() + 1, 0));
            break;

        case 'year':
            gte = startOf(new Date(now.getFullYear(), 0, 1));
            lte = endOf(new Date(now.getFullYear(), 11, 31));
            break;
    }

    return { gte, lte };
}