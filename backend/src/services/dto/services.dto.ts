import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";

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