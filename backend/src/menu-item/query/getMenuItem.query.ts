import { Transform } from "class-transformer";
import { IsBooleanString, IsOptional, IsString } from "class-validator";
import { isCapitalized } from "src/lib/customValidator/isCapitalized";

export class GetMenuItemsQuery {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    @isCapitalized()
    category?: string;

    @IsOptional()
    @IsBooleanString()
    @Transform(({ value }) => value === 'true')
    isActive?: boolean;
}