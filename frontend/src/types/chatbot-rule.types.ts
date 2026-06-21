import type { PaginationParams } from "./pagination.type";

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

export type CreateChatbotRule = {
    intentName: string;
    trainingPhrases: string[];
    response: string;
    quickReplies: string[];
    isActive: boolean;
}

export type UpdateChatbotRule = CreateChatbotRule;

export type InteractWithChatbotPayload = {
    message: string;
    sessionId?: string;
    userName?: string;
}

export type GetChatbotRuleQuery = {
    search?: string;
} & PaginationParams

export type ChatbotRuleStatistics = {
    total: number;
    active: number;
    inactive: number;
}
