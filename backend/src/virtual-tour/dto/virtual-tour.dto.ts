import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateVirtualTourSceneDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  initialYaw?: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  initialPitch?: number;
}

export class UpdateVirtualTourSceneDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  initialYaw!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  initialPitch!: number;
}

export class NavigationHotspotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  label!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string | null;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  yaw!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  pitch!: number;

  @IsString()
  @IsNotEmpty()
  targetSceneId!: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  targetYaw?: number | null;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  targetPitch?: number | null;

  @IsBoolean()
  isActive!: boolean;
}

export class InformationHotspotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  label!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string | null;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  yaw!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  pitch!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  infoTitle!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4_000)
  infoDescription!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2_000)
  infoImageUrl?: string | null;

  @IsBoolean()
  isActive!: boolean;
}

export class CreateConnectedSceneHotspotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  label!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string | null;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  yaw!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  pitch!: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  targetYaw?: number | null;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  targetPitch?: number | null;

  @IsBoolean()
  isActive!: boolean;
}

export class CreateConnectedSceneDto {
  @ValidateNested()
  @Type(() => CreateConnectedSceneHotspotDto)
  hotspot!: CreateConnectedSceneHotspotDto;

  @ValidateNested()
  @Type(() => CreateVirtualTourSceneDto)
  scene!: CreateVirtualTourSceneDto;
}
