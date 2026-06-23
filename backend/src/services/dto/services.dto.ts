import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";

export class CreateServiceDto {
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    imageUrl!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name!: string;

    @IsOptional()
    @IsString()
    @MinLength(20)
    @MaxLength(400)
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    price!: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity!: number;
}

export class UpdateServiceDto extends CreateServiceDto {}

export class UpdateServiceAvailabilityDto {
    @IsNotEmpty({ message: 'isActive is required' })
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive!: boolean;
}
