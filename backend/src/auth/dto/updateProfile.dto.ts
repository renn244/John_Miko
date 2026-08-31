import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";


export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsNumberString()
    contactNo!: string
}

export class UpdateProfileImageDto {
    @ValidateIf((_object, value) => value !== null)
    @IsUrl({}, { message: "Profile image must be a valid URL" })
    profileImageUrl!: string | null;
}
