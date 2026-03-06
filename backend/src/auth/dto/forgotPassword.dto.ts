import { IsEmail, IsString } from "class-validator";
import { IsMatch } from "src/lib/customValidator/isMatch";

export class forgotPasswordDto {
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email: string;
}

export class resendForgotPasswordDto {
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
    email: string;
}

export class resetPasswordDto {
    @IsString()
    token: string;

    @IsString()
    newPassword: string;
    
    @IsString()
    @IsMatch<resetPasswordDto>('newPassword', { message: 'Confirm password must match new password' })
    confirmPassword: string;
}
    