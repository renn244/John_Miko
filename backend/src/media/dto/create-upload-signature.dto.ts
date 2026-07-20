import { IsEnum } from 'class-validator';
import { MediaPurpose } from '../media-policy';

export class CreateUploadSignatureDto {
  @IsEnum(MediaPurpose, {
    message: `purpose must be one of: ${Object.values(MediaPurpose).join(', ')}`,
  })
  purpose!: MediaPurpose;
}
