export const toTimeOnly = (input?: Date | string | null): Date | string | undefined => {
    if (!input) return undefined;
    if (input instanceof Date) return input;

    // this could be extracted as a custom decorator for DTO
    const match = input.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return input;

    const [, hour, minute, second = "0"] = match;
    const date = new Date(Date.UTC(1970, 0, 1, Number(hour), Number(minute), Number(second), 0));

    return date;
};
