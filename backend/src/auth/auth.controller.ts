import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from '../lib/guards/auth.guard';
import { AuthService } from './auth.service';
import { SignInDto, SignUpGuestDto } from './dto/auth.dto';
import { forgotPasswordDto, resendForgotPasswordDto, resetPasswordDto } from './dto/forgotPassword.dto';
import { ForgotPasswordService } from './forgotPassword.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserModule } from 'src/user/user.module';
import { UpdatePasswordDto } from './dto/changePassword.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly forgotPasswordService: ForgotPasswordService,
    ) {}

    @Post('SignUpGuest')
    async SignUpGuest(@Body() body: SignUpGuestDto) {
        return this.authService.SignUpGuest(body);
    }

    @Post('login')
    async Login(@Body() body: SignInDto) {
        return this.authService.SignIn(body.email, body.password);
    }
    
    @Post('forgotPassword')
    async ForgotPassword(@Body() body: forgotPasswordDto) {
        return this.forgotPasswordService.forgetPassword(body.email);
    }

    @Post('resendForgotPassword')
    async ResendForgotPassword(@Body() body: resendForgotPasswordDto) {
        return this.forgotPasswordService.resendForgotPassword(body.email);
    }

    @Post('resetPassword')
    async ResetPassword(@Body() body: resetPasswordDto) {
        return this.forgotPasswordService.resetPassword(body);
    }
    
    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@User() user: UserSession) {
        return this.authService.getProfile(user);
    }

    @UseGuards(AuthGuard)
    @Patch('profile')
    async updateProfiel(@User() user: UserSession, @Body() body: UpdateProfileDto) {
        return this.authService.updateProfile(user, body)
    }

    @UseGuards(AuthGuard)
    @Patch('change-password')
    async changePassword(@User() user: UserSession, @Body() body: UpdatePasswordDto) {
        return this.authService.updatePassword(user, body);
    }
}
