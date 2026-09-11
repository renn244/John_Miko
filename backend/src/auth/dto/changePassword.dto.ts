import { IsNotEmpty, IsString } from "class-validator";
import { IsMatch } from "src/lib/customValidator/isMatch";
import { AccountPassword } from './account-password.decorator';

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword!: string;

    @IsNotEmpty()
    @IsString()
    @AccountPassword()
    newPassword!: string;

    @IsNotEmpty()
    @IsString()
    @IsMatch<UpdatePasswordDto>('newPassword', { message: 'must match the new password' })
    confirmPassword!: string
}
