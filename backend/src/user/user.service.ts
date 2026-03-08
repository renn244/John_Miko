import { Injectable } from '@nestjs/common';
import { SignUpGuestDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createUserGuest({ email, name, contactNo, password }: SignUpGuestDto) {
        return this.prisma.user.create({
            data: {
                email,
                name,
                contactNo,
                password
            }
        });
    }

    async createUserStaff(email: string, username: string) {
        
    } 

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({  where: { email }  });
    }

}
