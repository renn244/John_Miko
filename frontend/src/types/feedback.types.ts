
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

export type FeedbackOverviewItem = {
    user: {
        id: string;
        name: string;
        email: string;
    };
    booking?: {
        id: string;
        referenceCode: string | null;
        guestName: string;
        bookingDate: string;
        accommodation: {
            id: string;
            name: string;
            type: string;
        };
    } | null;
} & Feedback

export type FeedbackOverview = {
    total: number;
    averageRating: number;
    minRating: number;
    maxRating: number;
    receivedToday: number;
    recentFeedback: FeedbackOverviewItem[];
    lowRatingFeedback: FeedbackOverviewItem[];
}

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
