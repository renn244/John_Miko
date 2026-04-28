import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class GetFeedbackQuery {
    @IsNumber()
    @Type(() => Number)
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @IsNumber()
    @Type(() => Number)
    @Min(1, { message: 'Limit must be at least 1' })
    @Max(100, { message: 'Limit must be at most 100' })
    limit?: number = 10;
}