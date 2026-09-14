import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from '../lib/guards/auth.guard';
import { AuthService } from './auth.service';
import { SignInDto, SignUpGuestDto } from './dto/auth.dto';
import {
  forgotPasswordDto,
  resendForgotPasswordDto,
  resetPasswordDto,
} from './dto/forgotPassword.dto';
import { ForgotPasswordService } from './forgotPassword.service';
import { UpdateProfileDto, UpdateProfileImageDto } from './dto/updateProfile.dto';
import { UserModule } from 'src/user/user.module';
import { UpdatePasswordDto } from './dto/changePassword.dto';
import { PushTokenDto } from './dto/push-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @Post('SignUpGuest')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async SignUpGuest(@Body() body: SignUpGuestDto) {
    return this.authService.SignUpGuest(body);
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async Login(@Body() body: SignInDto) {
    return this.authService.SignIn(
      body.email,
      body.password,
      body.userRole,
      body.rememberMe,
    );
  }

  @Post('forgotPassword')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async ForgotPassword(@Body() body: forgotPasswordDto) {
    return this.forgotPasswordService.forgetPassword(body.email, body.platform);
  }

  @Post('resendForgotPassword')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async ResendForgotPassword(@Body() body: resendForgotPasswordDto) {
    return this.forgotPasswordService.resendForgotPassword(body.email, body.platform);
  }

  @Post('resetPassword')
  async ResetPassword(@Body() body: resetPasswordDto) {
    return this.forgotPasswordService.resetPassword(body);
  }

  @Get('reset-password/open')
  openResetPassword(
    @Query('token') token: string | undefined,
    @Res() response: Response,
  ) {
    if (!token) {
      throw new BadRequestException('Reset token is missing');
    }

    return response.redirect(
      this.forgotPasswordService.buildMobileResetUrl(token),
    );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@User() user: UserSession) {
    return this.authService.getProfile(user);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfiel(
    @User() user: UserSession,
    @Body() body: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user, body);
  }

  @UseGuards(AuthGuard)
  @Patch('profile-image')
  async updateProfileImage(
    @User() user: UserSession,
    @Body() body: UpdateProfileImageDto,
  ) {
    return this.authService.updateProfileImage(user, body.profileImageUrl);
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @User() user: UserSession,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(user, body);
  }

  @UseGuards(AuthGuard)
  @Patch('push-token')
  async registerPushToken(@User() user: UserSession, @Body() body: PushTokenDto) {
    return this.authService.registerPushToken(user, body.expoPushToken);
  }

  @UseGuards(AuthGuard)
  @Delete('push-token')
  async removePushToken(@User() user: UserSession) {
    return this.authService.removePushToken(user);
  }
}
