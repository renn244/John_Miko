import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/generated/prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async SignUp(email: string, username: string, password: string) {
        const existingUser = await this.userService.findUserByEmail(email);

        if(existingUser) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return this.userService.createUser(email, username, hashedPassword);
    }

    async SignIn(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);

        if(!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        return await this.loginJWT(user);
    }

    async loginJWT(user: User) {
        const payload = { email: user.email, id: user.id };

        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '30d' });

        return { accessToken };
    }
}