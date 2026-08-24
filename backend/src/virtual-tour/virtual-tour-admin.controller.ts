import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import {
  CreateConnectedSceneDto,
  CreateVirtualTourSceneDto,
  InformationHotspotDto,
  NavigationHotspotDto,
  UpdateVirtualTourSceneDto,
} from './dto/virtual-tour.dto';
import {
  ValidatedVirtualTourPanoramaUpload,
  VirtualTourPanoramaUploadPipe,
} from './virtual-tour-panorama-upload.pipe';
import { VirtualTourPanoramaService } from './virtual-tour-panorama.service';
import { virtualTourPanoramaUploadOptions } from './virtual-tour-upload.config';
import { VirtualTourService } from './virtual-tour.service';

@Controller('admin/virtual-tour')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class VirtualTourAdminController {
  constructor(
    private readonly virtualTourService: VirtualTourService,
    private readonly virtualTourPanoramaService: VirtualTourPanoramaService,
  ) {}

  @Get()
  getAdminTour() {
    return this.virtualTourService.getAdminTour();
  }

  @Post('starting-scene')
  createStartingScene(@Body() body: CreateVirtualTourSceneDto) {
    return this.virtualTourService.createStartingScene(body);
  }

  @Patch('scenes/:sceneId')
  updateScene(
    @Param('sceneId') sceneId: string,
    @Body() body: UpdateVirtualTourSceneDto,
  ) {
    return this.virtualTourService.updateScene(sceneId, body);
  }

  @Post('scenes/:sceneId/panorama')
  @UseInterceptors(
    FileInterceptor('panorama', virtualTourPanoramaUploadOptions),
  )
  uploadPanorama(
    @Param('sceneId') sceneId: string,
    @UploadedFile(VirtualTourPanoramaUploadPipe)
    upload: ValidatedVirtualTourPanoramaUpload,
  ) {
    return this.virtualTourPanoramaService.uploadPanorama(sceneId, upload);
  }

  @Post('scenes/:sceneId/navigation-hotspots')
  createNavigationHotspot(
    @Param('sceneId') sceneId: string,
    @Body() body: NavigationHotspotDto,
  ) {
    return this.virtualTourService.createNavigationHotspot(sceneId, body);
  }

  @Patch('navigation-hotspots/:hotspotId')
  updateNavigationHotspot(
    @Param('hotspotId') hotspotId: string,
    @Body() body: NavigationHotspotDto,
  ) {
    return this.virtualTourService.updateNavigationHotspot(hotspotId, body);
  }

  @Post('scenes/:sceneId/information-hotspots')
  createInformationHotspot(
    @Param('sceneId') sceneId: string,
    @Body() body: InformationHotspotDto,
  ) {
    return this.virtualTourService.createInformationHotspot(sceneId, body);
  }

  @Patch('information-hotspots/:hotspotId')
  updateInformationHotspot(
    @Param('hotspotId') hotspotId: string,
    @Body() body: InformationHotspotDto,
  ) {
    return this.virtualTourService.updateInformationHotspot(hotspotId, body);
  }

  @Delete('hotspots/:hotspotId')
  deleteHotspot(@Param('hotspotId') hotspotId: string) {
    return this.virtualTourService.deleteHotspot(hotspotId);
  }

  @Post('scenes/:sceneId/connected-scene')
  createConnectedScene(
    @Param('sceneId') sceneId: string,
    @Body() body: CreateConnectedSceneDto,
  ) {
    return this.virtualTourService.createConnectedScene(sceneId, body);
  }

  @Post('scenes/:sceneId/publish')
  publishScene(@Param('sceneId') sceneId: string) {
    return this.virtualTourService.publishScene(sceneId);
  }

  @Post('scenes/:sceneId/hide')
  hideScene(@Param('sceneId') sceneId: string) {
    return this.virtualTourService.setSceneHidden(sceneId);
  }

  @Post('scenes/:sceneId/draft')
  moveSceneToDraft(@Param('sceneId') sceneId: string) {
    return this.virtualTourService.setSceneDraft(sceneId);
  }

  @Delete('scenes/:sceneId')
  deleteScene(@Param('sceneId') sceneId: string) {
    return this.virtualTourService.deleteScene(sceneId);
  }
}
