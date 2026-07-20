import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { CreateUploadSignatureDto } from './dto/create-upload-signature.dto';
import { MediaService } from './media.service';

@Controller('media')
@UseGuards(AuthGuard, ThrottlerGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-signature')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  createUploadSignature(
    @User() user: UserSession,
    @Body() body: CreateUploadSignatureDto,
  ) {
    return this.mediaService.createUploadSignature(user, body.purpose);
  }
}
