import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { Role } from "src/generated/prisma/client";
import { NormalizeEmail } from "src/lib/decorators/NormalizeEmail.decorator";
import { IsMatch } from "src/lib/customValidator/isMatch";
import { AccountPassword } from './account-password.decorator';

export class SignInDto {
    @IsString()
    @NormalizeEmail()
    @IsEmail({}, { message: "Invalid email" })
    email!: string;

    @IsString()
    password!: string;

    @IsOptional()
    @IsString()
    turnstileToken?: string;

    @Transform(({ value }) => typeof value === "string" ? value.toUpperCase() : value)
    @IsEnum(Role, { message: "Invalid role" })
    userRole!: Role;

    @IsOptional()
    @IsBoolean()
    rememberMe: boolean = false;

    @IsOptional()
    @IsIn(['web', 'mobile'])
    platform?: 'web' | 'mobile' = 'web';
}

export class SignUpGuestDto {
    @IsString()
    @NormalizeEmail()
    @IsEmail({}, { message: "Invalid email" })
    email!: string;

    @IsString()
    name!: string;

    @IsNumberString({}, { message: "Invalid contact No." })
    contactNo!: string;

    @IsString()
    @AccountPassword()
    password!: string;

    @IsString()
    @IsMatch<SignUpGuestDto>("password", { message: "Confirm password must match password" })
    confirmPassword!: string

    @IsString()
    @IsNotEmpty({ message: 'Please complete the security check' })
    turnstileToken!: string;

    @IsOptional()
    @IsIn(['web', 'mobile'])
    platform?: 'web' | 'mobile' = 'web';
}
