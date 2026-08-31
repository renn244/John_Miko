import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  MaintenanceExpertise,
  ReportSeverity,
  ReportStatus,
  ReportType,
} from 'src/generated/prisma/enums';

export class CreateReportDto {
  @ValidateIf((body: CreateReportDto) => body.type !== ReportType.maintenance)
  @IsNotEmpty({
    message: 'bookingId is required for check-in and check-out reports',
  })
  @IsString()
  bookingId?: string;

  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  title!: string;

  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  description!: string;

  @IsArray({ message: 'proofImages must be an array' })
  @ArrayMinSize(1, { message: 'At least one proof image is required' })
  @ArrayMaxSize(3, { message: 'A maximum of three proof images is allowed' })
  @IsString({ each: true, message: 'each must be a string' })
  @IsUrl({}, { each: true, message: 'Each proof image must be a valid URL' })
  proofImages!: string[];

  @IsNotEmpty({ message: 'type is required' })
  @IsString()
  @IsEnum(ReportType, {
    message: 'type must be one of values (checkIn, checkOut, or maintenance)',
  })
  type!: ReportType;

  @IsNotEmpty({ message: 'severity is required' })
  @IsString()
  @IsEnum(ReportSeverity, {
    message: 'severity must be one of values (Low, Medium, High)',
  })
  severity!: ReportSeverity;
}

export class GetStaffReportsQuery {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'search must not be empty' })
  search?: string;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsEnum(ReportStatus, {
    message: 'status must be one of values (Pending, Approved, Rejected)',
  })
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(ReportType, {
    message: 'type must be one of values (checkIn, checkOut, maintenance)',
  })
  type?: ReportType;

  @IsOptional()
  @IsEnum(ReportSeverity, {
    message: 'severity must be one of values (Low, Medium, High)',
  })
  severity?: ReportSeverity;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsInt({ message: 'Page size must be an integer number' })
  @Min(1, { message: 'Page size must be at least 1' })
  @Max(100, { message: 'Page size must be at most 100' })
  limit?: number = 10;
}

export class ReviewReportDto {
  @IsNotEmpty({ message: 'status is required' })
  @IsString()
  @IsIn([ReportStatus.Approved, ReportStatus.Rejected], {
    message: 'status must be one of values (Approved, Rejected)',
  })
  status!: 'Approved' | 'Rejected';

  @ValidateIf((body: ReviewReportDto) => body.status === ReportStatus.Rejected)
  @IsNotEmpty({ message: 'rejectionNote is required when rejecting a report' })
  @IsString()
  rejectionNote?: string;

  @ValidateIf((body: ReviewReportDto) => body.status === ReportStatus.Approved)
  @IsNotEmpty({ message: 'expertise is required when approving a report' })
  @IsEnum(MaintenanceExpertise, {
    message: 'expertise must be one of values (Electrical, Pool, Construction)',
  })
  expertise?: MaintenanceExpertise;
}
