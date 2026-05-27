export type ClosureScope = "resort" | "accommodation";

export type ClosureType = "Close" | "Private";

export type Closure = {
    id: string;

    accommodationId?: string | null;

    date: string;
    reason?: string | null;

    type?: ClosureType;

    createdAt: string;
    updatedAt: string;
};

export type BookingForClosure = {
    bookingDate: string;
    bookingIds: string[];
}

export type CreateClosureDto = {
    accommodationId?: string;
    date: string;

    type?: ClosureType;

    reason?: string;
};
