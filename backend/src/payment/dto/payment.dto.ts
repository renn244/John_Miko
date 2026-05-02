import { IsInt, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsString()
    bookingId!: string;

    // breakdown of the payments
    @IsInt()
    accommodationFee!: number;

    @IsInt()
    preOrderFee!: number;

    @IsInt()
    guestFee!: number;

    @IsInt()
    amount!: number; 
}