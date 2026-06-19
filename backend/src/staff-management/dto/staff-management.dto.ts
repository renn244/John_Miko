import { MaintenanceExpertise, Role } from "src/generated/prisma/enums";
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsNumberString, IsString, ValidateIf } from "class-validator";

export class CreateStaffDto {
    @IsNotEmpty({ message: 'name is required!' })
    @IsString()
    name!: string;

    @IsNotEmpty({ message: 'email is required!' })
    @IsString()
    @IsEmail({}, { message: 'invalid email!' })
    email!: string;

    // add later proper phone number regex validator
    @IsNotEmpty({ message: 'contactNo is required!' })
    @IsNumberString()
    contactNo!: string;

    @IsNotEmpty({ message: 'role is required' })
    @IsIn([Role.KITCHEN_STAFF, Role.RESORT_STAFF, Role.MAINTENANCE_STAFF], {
        message: 'role must be one of KITCHEN_STAFF, RESORT_STAFF, or MAINTENANCE_STAFF',
    })
    role!: 'KITCHEN_STAFF' | 'RESORT_STAFF' | 'MAINTENANCE_STAFF';

    @ValidateIf((body: CreateStaffDto) => body.role === Role.MAINTENANCE_STAFF)
    @IsNotEmpty({ message: 'expertise is required for maintenance staff' })
    @IsEnum(MaintenanceExpertise, {
        message: 'expertise must be one of Electrical, Pool, or Construction',
    })
    expertise?: MaintenanceExpertise;
}

export class UpdateStaffRole {
    @IsNotEmpty({ message: 'role is required' })
    @IsIn([Role.KITCHEN_STAFF, Role.RESORT_STAFF, Role.MAINTENANCE_STAFF], {
        message: 'role must be one of KITCHEN_STAFF, RESORT_STAFF, or MAINTENANCE_STAFF',
    })
    role!: 'KITCHEN_STAFF' | 'RESORT_STAFF' | 'MAINTENANCE_STAFF';

    @ValidateIf((body: UpdateStaffRole) => body.role === Role.MAINTENANCE_STAFF)
    @IsNotEmpty({ message: 'expertise is required for maintenance staff' })
    @IsEnum(['Electrical', 'Pool', 'Construction'], {
        message: 'expertise must be one of Electrical, Pool, or Construction',
    })
    expertise?: MaintenanceExpertise;
}
