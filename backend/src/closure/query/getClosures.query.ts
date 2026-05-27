import { IsOptional, IsString } from "class-validator";

export class getClosuresQueryDto {
    @IsOptional()
    @IsString()
    accommodationId?: string;
}