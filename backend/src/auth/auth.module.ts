import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForgotPasswordService } from './forgotPassword.service';

@Module({
  providers: [AuthService, ForgotPasswordService],
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
  ]
})
export class AuthModule {}
