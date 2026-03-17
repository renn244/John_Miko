import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/generated/prisma/client';
import { ValidationException } from 'src/lib/exception/ValidationException';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { SignUpGuestDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async SignUpGuest(body: SignUpGuestDto) {
        const existingUser = await this.userService.findUserByEmail(body.email);

        if(existingUser) {
            throw new ValidationException({
                field: "email",
                message: ["User already exist"]
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const createdUser = await this.userService.createUserGuest({ ...body, password: hashedPassword });
    
        return this.loginJWT(createdUser)
    }

    // add roles validation later
    async SignIn(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);

        if(!user) {
            throw new ValidationException({
                field: "email",
                message: ["User with this email does not exist"]
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new ValidationException({
                field: "password",
                message: ["Incorrect password"]
            });
        }

        return this.loginJWT(user);
    }

    async loginJWT(user: User) {
        const payload = { email: user.email, id: user.id, role: user.role };

        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

        return { accessToken };
    }
}