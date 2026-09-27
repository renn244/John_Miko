import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
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
import { UpdatePasswordDto } from './dto/changePassword.dto';
import { PushTokenDto } from './dto/push-token.dto';
import { MobileRefreshSessionDto } from './dto/refresh-session.dto';
import { RefreshSessionOriginGuard } from 'src/lib/guards/refresh-session-origin.guard';
import { AuthRefreshSessionService, REFRESH_COOKIE_NAME } from './auth-refresh-session.service';
import { TurnstileService } from './turnstile.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly authRefreshSessions: AuthRefreshSessionService,
    private readonly turnstileService: TurnstileService,
  ) {}

  @Post('SignUpGuest')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async SignUpGuest(
    @Body() body: SignUpGuestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.turnstileService.verify(body.turnstileToken ?? '');
    const session = await this.authService.SignUpGuest(body);
    return this.authRefreshSessions.writeResponse(response, session, body.platform ?? 'web');
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async Login(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Native staff sign-in has no Turnstile widget yet; its existing rate limit remains in effect.
    if (body.platform !== 'mobile') {
      await this.turnstileService.verify(body.turnstileToken ?? '');
    }
    const session = await this.authService.SignIn(
      body.email,
      body.password,
      body.userRole,
      body.rememberMe,
      body.platform ?? 'web',
    );

    return this.authRefreshSessions.writeResponse(response, session, body.platform ?? 'web');
  }

  @Post('refresh')
  @UseGuards(ThrottlerGuard, RefreshSessionOriginGuard)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async refreshSession(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const session = await this.authService.refreshSession(refreshToken, 'web');
    return this.authRefreshSessions.writeResponse(response, session, 'web');
  }

  @Post('logout')
  @UseGuards(RefreshSessionOriginGuard)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    this.authRefreshSessions.clearWebCookie(response);

    if (refreshToken) await this.authService.logout(refreshToken, 'web');
    return { message: 'Logged out successfully' };
  }

  @Post('mobile/refresh')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async refreshMobileSession(@Body() body: MobileRefreshSessionDto) {
    return this.authService.refreshSession(body.refreshToken, 'mobile');
  }

  @Post('mobile/logout')
  async logoutMobile(@Body() body: MobileRefreshSessionDto) {
    await this.authService.logout(body.refreshToken, 'mobile');
    return { message: 'Logged out successfully' };
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
