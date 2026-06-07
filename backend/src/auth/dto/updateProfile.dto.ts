import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";


export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsNumberString()
    contactNo!: string
}