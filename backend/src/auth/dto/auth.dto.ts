import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";
import { Role } from "src/generated/prisma/client";
import { IsMatch } from "src/lib/customValidator/isMatch";

export class SignInDto {
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email!: string;

    @IsString()
    password!: string;

    @Transform(({ value }) => typeof value === "string" ? value.toUpperCase() : value)
    @IsEnum(Role, { message: "Invalid role" })
    userRole!: Role;

    @IsOptional()
    @IsBoolean()
    rememberMe: boolean = false;
}

export class SignUpGuestDto {
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email!: string;

    @IsString()
    name!: string;

    @IsNumberString({}, { message: "Invalid contact No." })
    contactNo!: string;

    @IsString()
    password!: string;

    @IsString()
    @IsMatch<SignUpGuestDto>("password", { message: "Confirm password must match password" })
    confirmPassword!: string
}
