import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthService } from './auth.service';
import { SignInDto, SignUpGuestDto } from './dto/auth.dto';
import { forgotPasswordDto, resendForgotPasswordDto, resetPasswordDto } from './dto/forgotPassword.dto';
import { ForgotPasswordService } from './forgotPassword.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly forgotPasswordService: ForgotPasswordService,
    ) {}

    // this will be removed later for deployment we only need one admin
    @Post('SignUpGuest')
    async SignUpGuest(@Body() body: SignUpGuestDto) {
        return this.authService.SignUpGuest(body);
    }

    @Post('login')
    // put class validator later
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
        return user;
    }
}
