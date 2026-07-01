
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
    booking?: {
        referenceCode: string | null;
    } | null
} & Feedback

export type GetFeedbackAnalyticsQuery = {
    interval: 'day' | 'week' | 'month' | 'year';
}

export type FeedbackAnalytics = {
    date: string;
    averageRating: string;
}

export type FeedbackCountPerRating = {
    rating: number;
    count: number;
}

export type FeedbackStats = {
    total: number;
    averageRating: number;
    minRating: number;
    maxRating: number;
}

export type FeedbackReport = {
    receivedOnDate: number;
    averageOnDate: number;
    distribution: FeedbackCountPerRating[];
}
