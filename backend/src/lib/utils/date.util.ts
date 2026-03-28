
export const toDateOnly = (input: Date | string): Date => {
    const date = new Date(input);
    
    date.setUTCHours(0, 0, 0, 0); 
    return date; 
};