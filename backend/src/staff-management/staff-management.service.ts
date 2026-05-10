import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserWhereInput } from 'src/generated/prisma/models';
import { ValidationException } from 'src/lib/exception/ValidationException';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStaffDto, UpdateStaffRole } from './dto/staff-management.dto';
import { getStaffsQueryDto } from './query/getStaffs.query';

@Injectable()
export class StaffManagementService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    private generateRandomPassword(name: string) {
        const shortStr = Math.random().toString(36).substring(2, 7);

        return `${name}-${shortStr}`;
    }

    async createStaff(body: CreateStaffDto) {
        const existingStaffUser = await this.prisma.user.findFirst({ 
            where: { email: body.email }
        })

        if(existingStaffUser) {
            throw new ValidationException({
                field: 'email',
                message: ['email already exists!']
            })
        }

        const password = await bcrypt.hash(this.generateRandomPassword(body.name), 10);

        const newStaff = await this.prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                contactNo: body.contactNo,
                role: body.role,
                password: password
            },
            omit: {
                password: true
            }
        })

        // send email here to the staff


        return newStaff
    }

    async getStaffs(query: getStaffsQueryDto) {

        const where: UserWhereInput = {
            OR: [
                { name: { contains: query.search || "", mode: 'insensitive' } },
                { id: { contains: query.search || "", mode: 'insensitive' } }
            ],
            role: query.role ? query.role : { in: ['KITCHEN_STAFF', 'RESORT_STAFF'] },
            status: query.status
        }

        const [data, total] = await Promise.all([
            await this.prisma.user.findMany({ 
                where: where, 
                omit: { password: true },
                ...getPaginationArgs(query.page, query.limit) 
            }),
            await this.prisma.user.count({ where: where })
        ])

        return {
            data: data,
            meta: getPaginationMeta(total, query.page, query.limit)
        }
    }

    async getStaffById(id: string) {
        const staffUser = await this.prisma.user.findFirst({
            where: {
                id: id,
                role: { in: ['KITCHEN_STAFF', 'RESORT_STAFF'] },
            },
            omit: {
                password: true
            }
        })

        if(!staffUser) {
            throw new NotFoundException('Staff User not Found!')
        }

        return staffUser
    }

    async updateStaffRole(id: string, body: UpdateStaffRole) {
        // check if the user exists
        await this.getStaffById(id);
        
        const updatedStaff = await this.prisma.user.update({
            where: { id },
            data: body
        })
        
        // send email to user

        return updatedStaff
    }

    async deactivateStaff(id: string) {
        // check if the user exists
        await this.getStaffById(id);

        const deactivatedStaffUser = await this.prisma.user.update({
            where: { id },
            data: { status: 'INACTIVE' },
            omit: { password: true }
        });

        return deactivatedStaffUser
    }

    async reactivateStaff(id: string) {
        // check if the user exists
        await this.getStaffById(id);
        
        const reactivatedStaffUser = await this.prisma.user.update({
            where: { id },
            data: { status: 'ACTIVE' },
            omit: { password: true }
        })
    
        return reactivatedStaffUser
    }
}
