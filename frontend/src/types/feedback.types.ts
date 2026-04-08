
export type Feedback = {
    id: string;

    userId: string;
    bookingId: string;
    
    rating: number;
    comment?: string;

    createdAt: string;
}

export type FeedbackWithUser = {
    user: {
        id: string;
        name: string;
        email: string;
    }
} & Feedback

export type FeedbackStats = {
    total: number;
    averageRating: number;
    minRating: number;
    maxRating: number;
}

