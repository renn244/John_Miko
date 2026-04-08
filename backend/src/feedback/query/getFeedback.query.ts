import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetFeedbackQuery {
    @IsNumber()
    @Type(() => Number)
    page?: number;
}