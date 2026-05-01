import { IsEnum, IsOptional, IsString } from "class-validator";

export class GetFeedbackAnalyticsQuery {
    @IsOptional()
    @IsString()
    @IsEnum(['day', 'week', 'month', 'year'], { message: 'Interval must be one of day, week, month, or year' })
    interval: 'day' | 'week' | 'month' | 'year' = 'month';
}