import { Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import { VirtualTourAdminController } from './virtual-tour-admin.controller';
import { VirtualTourController } from './virtual-tour.controller';
import { VirtualTourService } from './virtual-tour.service';
import { VirtualTourPanoramaService } from './virtual-tour-panorama.service';
import { VirtualTourStorageService } from './virtual-tour-storage.service';
import { VirtualTourPanoramaUploadPipe } from './virtual-tour-panorama-upload.pipe';

@Module({
  imports: [MediaModule],
  controllers: [VirtualTourController, VirtualTourAdminController],
  providers: [
    VirtualTourService,
    VirtualTourPanoramaService,
    VirtualTourPanoramaUploadPipe,
    VirtualTourStorageService,
  ],
  exports: [VirtualTourService],
})
export class VirtualTourModule {}
