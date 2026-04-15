
export type ChatbotRule = {
    id: string;

    name: string;
    keywords: string[];
    response: string;
    quickReplies: string[];
    isActive: boolean;
    
    createdAt: string;
    updatedAt: string;
}

export type ChatbotRuleStatistics = {
    total: number;
    active: number;
    inactive: number;
}