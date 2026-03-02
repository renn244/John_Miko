import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    // this will be removed later for deployment we only need one admin
    @Post('SignUp')
    async SignUp(@Body() body: { email: string, username: string, password: string }) {
        return this.authService.SignUp(body.email, body.username, body.password);
    }

    @Post('login')
    // put class validator later
    async Login(@Body() body: { email: string, password: string }) {
        return this.authService.SignIn(body.email, body.password);
    }
}
