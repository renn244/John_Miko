import { IsEmail, IsString } from "class-validator";

export class SignInDto {
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email: string;

    @IsString()
    password: string;
}