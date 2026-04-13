import { PartialType } from "@nestjs/mapped-types/dist/partial-type.helper";
import { IsArray, IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class createRuleDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(40, { message: 'Name must be at most 40 characters long' })
    name!: string;

    @IsNotEmpty({ message: 'Keywords are required' })
    @IsArray({ message: 'Keywords must be an array' })
    @IsString({ each: true, message: 'Each keyword must be a string' })
    keywords!: string[];

    @IsNotEmpty({ message: 'Response is required' })
    @IsString({ message: 'Response must be a string' })
    response!: string;

    @IsNotEmpty({ message: 'Quick replies are required' })
    @IsArray({ message: 'Quick replies must be an array' })
    @IsString({ each: true, message: 'Each quick reply must be a string' })
    quickReplies!: string[];

    @IsNotEmpty({ message: 'isActive is required' })
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive!: boolean; 
}

export class availabilityRuleDto {
    @IsNotEmpty({ message: 'isActive is required' })
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive!: boolean;
}

export class updateRuleDto extends PartialType(createRuleDto) {}