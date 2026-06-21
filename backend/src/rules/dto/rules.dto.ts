import { PartialType } from "@nestjs/mapped-types/dist/partial-type.helper";
import { Transform } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRuleDto {
    @Transform(({ value, obj }) => value ?? obj?.name)
    @IsNotEmpty()
    @IsString()
    intentName!: string;

    @Transform(({ value, obj }) => value ?? obj?.keywords)
    @IsArray()
    @ArrayMinSize(5)
    @IsString({ each: true })
    trainingPhrases!: string[];

    @IsNotEmpty()
    @IsString()
    response!: string;
}

export class AvailabilityRuleDto {
    @IsNotEmpty({ message: 'isActive is required' })
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive!: boolean;
}

export class ChatbotMessageDto {
    @IsNotEmpty()
    @IsString()
    message!: string;

    @IsOptional()
    @IsString()
    sessionId?: string;

    @IsOptional()
    @IsString()
    userName?: string;
}

export class UpdateRuleDto extends PartialType(CreateRuleDto) {}
