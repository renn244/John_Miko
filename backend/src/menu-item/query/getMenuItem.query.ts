import { IsEnum, IsOptional, IsString } from "class-validator";
import { MenuItemAvailability } from "src/generated/prisma/enums";
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
    @IsEnum([MenuItemAvailability.Unavailable, MenuItemAvailability.Available], {
        message: "Availability must be either 'Unavailable' or 'Available'"
    })
    availability?: MenuItemAvailability;
}