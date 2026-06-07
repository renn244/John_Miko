import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsMatch } from "src/lib/customValidator/isMatch";

export class forgotPasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email!: string;
}

export class resendForgotPasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email!: string;
}

export class resetPasswordDto {
    @IsNotEmpty()
    @IsString()
    token!: string;

    @IsNotEmpty()
    @IsString()
    newPassword!: string;
    
    @IsNotEmpty()
    @IsString()
    @IsMatch<resetPasswordDto>('newPassword', { message: 'Confirm password must match new password' })
    confirmPassword!: string;
}
    