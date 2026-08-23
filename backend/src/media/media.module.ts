import { Module } from '@nestjs/common';
import { CLOUDINARY, CloudinaryProvider } from './cloudinary.provider';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [CloudinaryProvider, MediaService],
  exports: [CLOUDINARY],
})
export class MediaModule {}
