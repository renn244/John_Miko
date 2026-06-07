import { IsNotEmpty, IsString } from "class-validator";
import { IsMatch } from "src/lib/customValidator/isMatch";

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword!: string;

    @IsNotEmpty()
    @IsString()
    newPassword!: string;

    @IsNotEmpty()
    @IsString()
    @IsMatch<UpdatePasswordDto>('newPassword', { message: 'must match the new password' })
    confirmPassword!: string
}