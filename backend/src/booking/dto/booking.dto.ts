import { Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Matches, Min } from "class-validator";
import { BookingTimeSlot, PaymentType } from "src/generated/prisma/enums";
import { isNotPastDate } from "src/lib/customValidator/isNotPastDate";
import { toDateOnly } from "src/lib/utils/date.util";

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty({ message: "Accommodation ID is required" })
    accommodationId: string;

    @IsString()
    @IsNotEmpty({ message: "Name is required" })
    name: string;

    @IsEmail()
    @IsNotEmpty({ message: "Email is required" })
    email: string;
    
    @IsNumberString()
    @IsNotEmpty({ message: "Phone number is required" })
    @Matches(/^[0-9]{10,15}$/, { message: "Phone number must be between 10 and 15 digits" })
    contactNo: string;
    
    @Type(() => Number)
    @IsNumber()
    @Min(1, { message: "At least 1 guest is required" })
    @IsNotEmpty({ message: "Number of guests is required" })
    numberOfGuests: number;

    @IsString()
    @IsOptional()
    specialRequest?: string;
    
    @IsNotEmpty({ message: "Stay type is required" })
    @IsEnum(BookingTimeSlot, { message: "Stay type must be either 'overnight' or 'daystay'" })
    stayType: BookingTimeSlot;
    
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate({ message: "Check-in date must be a valid date" })
    @IsNotEmpty({ message: "Check-in date is required" })
    @isNotPastDate({ message: "Check-in date cannot be in the past" })
    checkIn: Date;

    // create a payment type field in the database
    @IsNotEmpty({ message: "Payment type is required" })
    @IsEnum(PaymentType, { message: "Payment type must be either 'full' or 'partial'" })
    paymentType: PaymentType;
}

export class RescheduleBookingDto {
    @Transform(({ value }) => toDateOnly(value))
    @Type(() => Date)
    @IsDate({ message: "Booking date must be a valid date" })
    @IsNotEmpty({ message: "Booking date is required" })
    @isNotPastDate({ message: "Booking date cannot be in the past" })
    bookingDate: Date;

    @IsNotEmpty({ message: "Stay type is required" })
    @IsEnum(BookingTimeSlot, { message: "Stay type must be either 'overnight' or 'daystay'" })
    stayType: BookingTimeSlot;
}