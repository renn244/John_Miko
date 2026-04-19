import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
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
}

export class GetBookingsByUserQuery {
    @IsOptional()
    @IsEnum([BookingStatus.Completed, BookingStatus.Confirmed, BookingStatus.Cancelled], { message: `Status must be one of: ${Object.values(BookingStatus).join(", ")}` })
    status?: string;
}