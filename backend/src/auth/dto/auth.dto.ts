import { IsEmail, IsNumberString, IsString } from "class-validator";
import { IsMatch } from "src/lib/customValidator/isMatch";

export class SignInDto {
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email: string;

    @IsString()
    password: string;
}

export class SignUpGuestDto {
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email: string;

    @IsString()
    name: string;

    @IsNumberString({}, { message: "Invalid contact No." })
    contactNo: string;

    @IsString()
    password: string;

    @IsString()
    @IsMatch<SignUpGuestDto>("password", { message: "Confirm password must match password" })
    confirmPassword: string
}