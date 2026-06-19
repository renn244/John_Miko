import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/generated/prisma/enums';
import { UserWhereInput } from 'src/generated/prisma/models';
import { ValidationException } from 'src/lib/exception/ValidationException';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStaffDto, UpdateStaffRole } from './dto/staff-management.dto';
import { getStaffsQueryDto } from './query/getStaffs.query';
import { StaffManagementEmailService } from './staff-management-email.service';

@Injectable()
export class StaffManagementService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly staffManagementEmailService: StaffManagementEmailService,
    ) {}

    private readonly manageableRoles = [
        Role.KITCHEN_STAFF,
        Role.RESORT_STAFF,
        Role.MAINTENANCE_STAFF,
    ] as const;

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

        const rawPassword = this.generateRandomPassword(body.name)
        const password = await bcrypt.hash(rawPassword, 10);

        const newStaff = await this.prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                contactNo: body.contactNo,
                role: body.role,
                expertise: body.role === Role.MAINTENANCE_STAFF ? body.expertise : null,
                password: password
            },
            omit: {
                password: true
            }
        })

        await this.staffManagementEmailService.sendCreatedEmail({
            name: newStaff.name,
            email: newStaff.email,
            role: newStaff.role,
            expertise: newStaff.expertise,
            temporaryPassword: rawPassword,
        });

        return newStaff
    }

    async getStaffs(query: getStaffsQueryDto) {

        const where: UserWhereInput = {
            OR: [
                { name: { contains: query.search || "", mode: 'insensitive' } },
                { id: { contains: query.search || "", mode: 'insensitive' } }
            ],
            role: query.role ? query.role : { in: [...this.manageableRoles] },
            status: query.status
        }

        const [data, total] = await Promise.all([
            this.prisma.user.findMany({ 
                where: where, 
                omit: { password: true },
                ...getPaginationArgs(query.page, query.limit) 
            }),
            this.prisma.user.count({ where: where })
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
                role: { in: [...this.manageableRoles] },
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
            data: {
                role: body.role,
                expertise: body.role === Role.MAINTENANCE_STAFF ? body.expertise : null,
            },
            omit: {
                password: true,
            }
        })
        
        await this.staffManagementEmailService.sendRoleUpdatedEmail({
            name: updatedStaff.name,
            email: updatedStaff.email,
            role: updatedStaff.role,
            expertise: updatedStaff.expertise,
        });

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

        await this.staffManagementEmailService.sendDeactivatedEmail({
            name: deactivatedStaffUser.name,
            email: deactivatedStaffUser.email,
            role: deactivatedStaffUser.role,
            expertise: deactivatedStaffUser.expertise,
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

        await this.staffManagementEmailService.sendReactivatedEmail({
            name: reactivatedStaffUser.name,
            email: reactivatedStaffUser.email,
            role: reactivatedStaffUser.role,
            expertise: reactivatedStaffUser.expertise,
        });
    
        return reactivatedStaffUser
    }
}
