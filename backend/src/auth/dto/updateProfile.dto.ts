import { IsEmail, IsNotEmpty, Matches, IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";


export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{10,15}$/, { message: 'Contact number must contain 10–15 digits only (no spaces or symbols)' })
    contactNo!: string
}

export class UpdateProfileImageDto {
    @ValidateIf((_object, value) => value !== null)
    @IsUrl({}, { message: "Profile image must be a valid URL" })
    profileImageUrl!: string | null;
}
