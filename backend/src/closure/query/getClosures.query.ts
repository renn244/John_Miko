import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class getClosuresQueryDto {
    @IsOptional()
    @IsString()
    accommodationId?: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['withGlobal', 'specific'])
    mode: 'withGlobal' | 'specific' = 'withGlobal'
}