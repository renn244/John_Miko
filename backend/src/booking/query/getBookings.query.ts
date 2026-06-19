import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { BookingStatus, PaymentType } from "src/generated/prisma/enums";
import { toDateOnly } from "src/lib/utils/date.util";

export class GetBookingsQuery {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(BookingStatus, { message: `Status must be one of: ${Object.values(BookingStatus).join(", ")}` })
    status?: string;

    @IsOptional()
    @IsEnum(PaymentType, { message: `Payment Type must be one of: ${Object.values(PaymentType).join(", ")}` })
    paymentType?: string;

    @IsOptional()
    @IsString()
    accommodationId?: string;

    @IsOptional()
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate()
    bookingDate?: Date;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page must be an integer number' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page size must be an integer number' })
    @Min(1,  { message: 'Page size must be at least 1' })
    @Max(100, { message: 'Page size must be at most 100' })
    limit?: number = 10;
}

export class GetBookingsByUserQuery {
    @IsOptional()
    @IsEnum([BookingStatus.Completed, BookingStatus.Confirmed, BookingStatus.Cancelled], { message: `Status must be one of: ${Object.values(BookingStatus).join(", ")}` })
    status?: string;
    
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page must be an integer number' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page size must be an integer number' })
    @Min(1,  { message: 'Page size must be at least 1' })
    @Max(100, { message: 'Page size must be at most 100' })
    limit?: number = 10;
    
}

export class GetStaffBookingsQuery {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page must be an integer number' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page size must be an integer number' })
    @Min(1, { message: 'Page size must be at least 1' })
    @Max(100, { message: 'Page size must be at most 100' })
    limit?: number = 10;
}
