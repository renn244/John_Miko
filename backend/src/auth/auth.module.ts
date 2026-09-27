import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthRefreshSessionService } from './auth-refresh-session.service';
import { AuthService } from './auth.service';
import { ForgotPasswordService } from './forgotPassword.service';
import { RefreshSessionOriginGuard } from 'src/lib/guards/refresh-session-origin.guard';
import { TurnstileService } from './turnstile.service';

@Module({
  providers: [
    AuthService,
    ForgotPasswordService,
    AuthRefreshSessionService,
    RefreshSessionOriginGuard,
    TurnstileService,
  ],
  controllers: [AuthController],
  imports: [
    UserModule, EmailModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '7d' },
        }
      },
    })
  ],
  exports: [AuthRefreshSessionService],
})
export class AuthModule {}
