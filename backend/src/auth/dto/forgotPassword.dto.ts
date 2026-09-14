import { IsEmail, IsNotEmpty, IsString, IsOptional, IsIn } from "class-validator";
import { IsMatch } from "src/lib/customValidator/isMatch";
import { AccountPassword } from './account-password.decorator';

export class forgotPasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email!: string;

    @IsOptional()
    @IsIn(['web', 'mobile'])
    platform?: 'web' | 'mobile';
}

export class resendForgotPasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email!: string;

    @IsOptional()
    @IsIn(['web', 'mobile'])
    platform?: 'web' | 'mobile';
}

export class resetPasswordDto {
    @IsNotEmpty()
    @IsString()
    token!: string;

    @IsNotEmpty()
    @IsString()
    @AccountPassword()
    newPassword!: string;

    @IsNotEmpty()
    @IsString()
    @IsMatch<resetPasswordDto>('newPassword', { message: 'Confirm password must match new password' })
    confirmPassword!: string;
}

