import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateFeedbackDto {
    @IsNotEmpty()
    @IsString()
    bookingId!: string;

    @IsOptional()
    @IsString()
    comment?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating cannot be more than 5" })
    rating!: number;
}

export class UpdateFeedbackDto {
    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsNumber()
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating cannot be more than 5" })
    rating!: number;
}