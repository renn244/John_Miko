import { IsEnum, IsString } from "class-validator";

export class UpdateGuestStatusDto {
    @IsString()
    @IsEnum(['ACTIVE', 'INACTIVE'], { message: 'status must be one of ACTIVE or INACTIVE' })
    status!: 'ACTIVE' | 'INACTIVE';
}
