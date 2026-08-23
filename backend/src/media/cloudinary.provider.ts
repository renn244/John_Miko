import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = Symbol('CLOUDINARY');
export type CloudinaryClient = typeof cloudinary | undefined;

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    if (configService.get<string>('MEDIA_UPLOADS_ENABLED') === 'false') {
      return undefined;
    }

    const apiKey =
      configService.get<string>('CLOUDINARY_API_KEY') ||
      configService.getOrThrow<string>('CLOUDINARY_KEY');
    const apiSecret =
      configService.get<string>('CLOUDINARY_API_SECRET') ||
      configService.getOrThrow<string>('CLOUDINARY_SECRET');

    cloudinary.config({
      cloud_name: configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    return cloudinary;
  },
};
