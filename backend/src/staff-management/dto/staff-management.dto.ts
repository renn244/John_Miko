import { PickType } from "@nestjs/mapped-types";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateStaffDto {
    @IsNotEmpty({ message: 'name is required!' })
    @IsString()
    name!: string;

    @IsNotEmpty({ message: 'email is required!' })
    @IsString()
    @IsEmail({}, { message: 'invalid email!' })
    email!: string;

    // add later proper phone number regex validator
    @IsNotEmpty({ message: 'contactNo is required!' })
    @IsNumberString()
    contactNo!: string;

    @IsNotEmpty({ message: 'role is required' })
    @IsEnum(['KITCHEN_STAFF', 'RESORT_STAFF'], { message: 'role must be one of KITCHEN_STAFF or RESORT_STAFF' })
    role!: 'KITCHEN_STAFF' | 'RESORT_STAFF';
}

export class UpdateStaffRole extends PickType(CreateStaffDto, ['role']) {}