import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaffReportsService {
    constructor(
        private readonly prisma: PrismaService,
        // inject booking
    ) {}

    async createReports(user: UserSession, body: { bookingId: string, title: string, description: string, proofImages: string[] }) {
        const report = await this.prisma.report.create({
            data: {
                bookingId: body.bookingId,
                userId: user.id,
                title: body.title,
                description: body.description,
                proofImages: body.proofImages,
            }
        })

        return report;
    }

    async viewReports(query: { page?: number }) {
        const page = query.page || 1;
        const skip = (page - 1) * 10;
        
        const reports = await this.prisma.report.findMany({
            skip,
            take: 10
        })

        return reports;
    }

    async viewReportsByUserId(user: UserSession, query: { page?: number }) {
        // only allow if the user is viewing their own reports, or if they are an admin
        const page = query.page || 1;
        const skip = (page - 1) * 10;

        const reports = await this.prisma.report.findMany({
            where: {
                userId: user.id
            },
            skip,
            take: 10
        });

        return reports;
    }

    async viewReportById(user: UserSession, id: string) {
        // only allow if the user is viewing their own report, or if they are an admin

        const report = await this.prisma.report.findUnique({
            where: {
                id
            }
        });

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        return report;
    }
}
