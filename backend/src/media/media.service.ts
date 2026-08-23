import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { CLOUDINARY, CloudinaryClient } from './cloudinary.provider';
import {
  MEDIA_POLICIES,
  MediaPurpose,
  MediaDeliveryType,
  MediaVisibility,
} from './media-policy';

export type UploadSignatureResponse = {
  cloudName: string;
  apiKey: string;
  uploadUrl: string;
  uploadPreset: string;
  timestamp: number;
  signature: string;
  publicId: string;
  deliveryType: MediaDeliveryType;
  visibility: MediaVisibility;
  deliveryUrl?: string;
};

@Injectable()
export class MediaService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinary: CloudinaryClient,
    private readonly configService: ConfigService,
  ) {}

  createUploadSignature(
    user: UserSession,
    purpose: MediaPurpose,
  ): UploadSignatureResponse {
    const cloudinary = this.cloudinary;
    if (!cloudinary) {
      throw new ServiceUnavailableException(
        'Media uploads are disabled in this environment.',
      );
    }

    const policy = MEDIA_POLICIES[purpose];

    if (!policy.allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You are not allowed to upload this type of media',
      );
    }

    const cloudinaryConfig = cloudinary.config();
    const cloudName = cloudinaryConfig.cloud_name!;
    const apiKey = cloudinaryConfig.api_key!;
    const apiSecret = cloudinaryConfig.api_secret!;
    const uploadPreset = this.getRequiredConfig(
      policy.visibility === 'private'
        ? 'CLOUDINARY_PRIVATE_UPLOAD_PRESET'
        : 'CLOUDINARY_PUBLIC_UPLOAD_PRESET',
    );

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `${policy.publicIdPrefix}/${randomUUID()}`;
    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: publicId,
        timestamp,
        type: policy.deliveryType,
        upload_preset: uploadPreset,
      },
      apiSecret,
    );

    const response: UploadSignatureResponse = {
      cloudName,
      apiKey,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      uploadPreset,
      timestamp,
      signature,
      publicId,
      deliveryType: policy.deliveryType,
      visibility: policy.visibility,
    };

    if (policy.visibility === 'private') {
      response.deliveryUrl = cloudinary.url(publicId, {
        resource_type: 'image',
        type: 'authenticated',
        secure: true,
        sign_url: true,
      });
    }

    return response;
  }

  private getRequiredConfig(key: string) {
    const value = this.configService.get<string>(key)?.trim();

    if (!value) {
      throw new InternalServerErrorException(
        `Cloudinary configuration is missing: ${key}`,
      );
    }

    return value;
  }
}
