import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl, Matches, Min, ValidateNested } from "class-validator";
import { BookingStatus, PaymentType } from "src/generated/prisma/enums";
import { isNotPastDate } from "src/lib/customValidator/isNotPastDate";
import { toDateOnly } from "src/lib/utils/date.util";

export class PreOrderItemDto {
    @IsString()
    menuItemId!: string;

    @IsNumber()
    quantity!: number;
}

export class AddOnServiceItemDto {
    @IsString()
    addOnServiceId!: string;

    @IsNumber()
    quantity!: number;
}

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty({ message: "Accommodation ID is required" })
    accommodationId!: string;

    @IsString()
    @IsNotEmpty({ message: "Name is required" })
    name!: string;

    @IsEmail()
    @IsNotEmpty({ message: "Email is required" })
    email!: string;
    
    @IsNumberString()
    @IsNotEmpty({ message: "Phone number is required" })
    @Matches(/^[0-9]{10,15}$/, { message: "Phone number must be between 10 and 15 digits" })
    contactNo!: string;
    
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty({ message: "adultGuests is required" })
    adultGuests!: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty({ message: "kidGuests required" })
    kidGuests!: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty({ message: "seniorGuests required" })
    seniorGuests!: number;

    @IsString()
    @IsOptional()
    specialRequest?: string;

    @IsString()
    @IsNotEmpty({ message: "Stay option is required" })
    stayOptionId!: string;
    
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate({ message: "Check-in date must be a valid date" })
    @IsNotEmpty({ message: "Check-in date is required" })
    @isNotPastDate({ message: "Check-in date cannot be in the past" })
    checkIn!: Date;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PreOrderItemDto)
    preOrderItems?: PreOrderItemDto[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AddOnServiceItemDto)
    addOnServices?: AddOnServiceItemDto[];

    @IsNotEmpty({ message: "Payment type is required" })
    @IsEnum(PaymentType, { message: "Payment type must be either 'full' or 'partial'" })
    paymentType!: PaymentType;

    @IsString()
    @IsNotEmpty({ message: "Payment method is required" })
    paymentMethodId!: string;

    @IsString()
    @IsNotEmpty({ message: "Proof of payment is required" })
    @IsUrl()
    proofImageUrl!: string;
}

export class CreateManualBookingDto {
    @IsString()
    @IsNotEmpty({ message: "Accommodation ID is required" })
    accommodationId!: string;

    @IsString()
    @IsNotEmpty({ message: "Name is required" })
    name!: string;

    @IsEmail()
    @IsNotEmpty({ message: "Email is required" })
    email!: string;

    @IsNumberString()
    @IsNotEmpty({ message: "Phone number is required" })
    @Matches(/^[0-9]{10,15}$/, { message: "Phone number must be between 10 and 15 digits" })
    contactNo!: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    adultGuests!: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    kidGuests!: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    seniorGuests!: number;

    @IsString()
    @IsOptional()
    specialRequest?: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    proofImageUrl?: string;

    @IsString()
    @IsNotEmpty({ message: "Stay option is required" })
    stayOptionId!: string;

    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate({ message: "Check-in date must be a valid date" })
    @IsNotEmpty({ message: "Check-in date is required" })
    @isNotPastDate({ message: "Check-in date cannot be in the past" })
    checkIn!: Date;

    @IsNotEmpty({ message: "Payment type is required" })
    @IsEnum(PaymentType, { message: "Payment type must be either 'full' or 'partial'" })
    paymentType!: PaymentType;
}

export class RescheduleBookingDto {
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate({ message: "Booking date must be a valid date" })
    @IsNotEmpty({ message: "Booking date is required" })
    @isNotPastDate({ message: "Booking date cannot be in the past" })
    bookingDate!: Date;

    @IsString()
    @IsNotEmpty({ message: "Stay option is required" })
    stayOptionId!: string;
}

export class ChangeStatusDto {
    @IsNotEmpty({ message: "Status is required" })
    @IsEnum(
        [BookingStatus.Confirmed, BookingStatus.Cancelled, BookingStatus.Completed], 
        { message: "Status must be either 'Confirmed', 'Cancelled', or 'Completed'" }
    )
    status!: BookingStatus;
}
