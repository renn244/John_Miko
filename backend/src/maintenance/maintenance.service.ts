import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import {
    MaintenanceExpertise,
    MaintenanceStatus,
    Role,
    UserStatus,
} from 'src/generated/prisma/enums';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { getDateRange, getSingleDayRange } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    CompleteMaintenanceDto,
    CreateMaintenanceDto,
    UpdateMaintenanceDto,
} from './dto/maintenance.dto';
import { GetMaintenanceDto } from './query/getMaintenance.dto';
import { PushNotificationService } from 'src/notifications/push-notification.service';

@Injectable()
export class MaintenanceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pushNotifications: PushNotificationService,
    ) {}

    async createMaintenance(_user: UserSession, body: CreateMaintenanceDto) {
        const assignedToId = await this.selectAssignee(body.expertise);

        const newMaintenance = await this.prisma.maintenance.create({
            data: {
                title: body.title,
                description: body.description,
                imagesUrl:  body.imagesUrl,
                priority: body.priority,
                expertise: body.expertise,
                assignedToId,
            }
        })

        if (assignedToId) {
            await this.pushNotifications.sendMaintenanceAssignment({
                userId: assignedToId,
                maintenanceId: newMaintenance.id,
                title: newMaintenance.title,
                priority: newMaintenance.priority,
            });
        }

        return newMaintenance;
    }

    async getMaintenances(query: GetMaintenanceDto) {
        const { search, page, limit, ...rest } = cleanPrismaWhere(query);

        const where: Prisma.MaintenanceWhereInput = {
            ...rest,
            ...(search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { id: { contains: search, mode: 'insensitive' } },
                ]
            } : {})
        };

        const [data, total] = await Promise.all([
            this.prisma.maintenance.findMany({
                where,
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            expertise: true,
                        },
                    },
                },
                ...getPaginationArgs(page, limit),
                orderBy: [
                    { status: "asc" }, // Pending -> In Progress -> Resolved -> Closed
                    { priority: 'desc' }, // high -> medium -> low
                    { createdAt: 'desc' }, // recent tickets
                ]
            }),
            this.prisma.maintenance.count({ where })
        ])

        return {
            data,
            meta: getPaginationMeta(total, page, limit)
        };
    }

    async getMaintenanceReport(date?: Date) {
        const { gte, lte } = getSingleDayRange(date)

        const [newTickets, resolvedTickets] = await Promise.all([
            this.prisma.maintenance.count({ where: { createdAt: { gte, lte } } }),
            this.prisma.maintenance.count({ where: { resolvedAt: { gte, lte } } }),
        ])

        return {
            newTickets,
            resolvedTickets
        }
    }

    async getMaintenanceStats() {
        const [total, grouped] = await Promise.all([
            this.prisma.maintenance.count(),
            this.prisma.maintenance.groupBy({
                by: ['status'],
                _count: { status: true }
            })
        ])

        const stats: Record<string, number> = {};
        grouped.forEach((item) => stats[item.status] = item._count.status);

        return { total, ...stats };
    }

    async getMaintenanceOverview(date?: Date) {
        const { gte, lte } = getSingleDayRange(date);
        const activeStatuses: MaintenanceStatus[] = ['Pending', 'InProgress'];

        const [
            grouped,
            openMaintenance,
            highPriorityOpen,
            highPriorityTickets,
            newTicketsToday,
            resolvedTicketsToday,
        ] = await Promise.all([
            this.prisma.maintenance.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            this.prisma.maintenance.count({
                where: { status: { in: activeStatuses } },
            }),
            this.prisma.maintenance.count({
                where: {
                    status: { in: activeStatuses },
                    priority: 'High',
                },
            }),
            this.prisma.maintenance.findMany({
                where: {
                    status: { in: activeStatuses },
                    priority: 'High',
                },
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            expertise: true,
                        },
                    },
                },
                take: 5,
                orderBy: [
                    { status: 'asc' },
                    { createdAt: 'desc' },
                ],
            }),
            this.prisma.maintenance.count({
                where: { createdAt: { gte, lte } },
            }),
            this.prisma.maintenance.count({
                where: { resolvedAt: { gte, lte } },
            }),
        ]);

        const statusCounts = {
            Pending: 0,
            InProgress: 0,
            Completed: 0,
            Closed: 0,
        };

        grouped.forEach((item) => {
            statusCounts[item.status] = item._count.status;
        });

        return {
            statusCounts,
            openMaintenance,
            highPriorityOpen,
            highPriorityTickets,
            today: {
                newTickets: newTicketsToday,
                resolvedTickets: resolvedTicketsToday,
            },
        };
    }

    async getMaintenanceById(id: string) {
        const maintenance = await this.prisma.maintenance.findUnique({
            where: { id },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        expertise: true,
                    },
                },
            },
        })

        if(!maintenance) {
            throw new NotFoundException("Maintenance ticket not found");
        }

        return maintenance;
    }
    
    async updateMaintenance(id: string, body: UpdateMaintenanceDto) {
        const maintenance = await this.prisma.maintenance.findUnique({
            where: { id }
        })

        if(!maintenance) {
            throw new NotFoundException("Maintenance ticket not found");
        }

        // reassigned if expertise is changed, otherwise keep the same assignee
        const nextExpertise = body.expertise ?? maintenance.expertise;
        const expertiseChanged = body.expertise && body.expertise !== maintenance.expertise;
        const assignedToId = expertiseChanged
            ? await this.selectAssignee(nextExpertise)
            : undefined;

        const updatedMaintenance = await this.prisma.maintenance.update({
            where: { id },
            data: {
                ...body,
                ...(expertiseChanged ? { assignedToId: assignedToId ?? null } : {}),
            }
        })

        return updatedMaintenance;
    }

    async startMaintenance(user: UserSession, id: string) {
        const maintenance = await this.findOrThrow(id)
        this.assertCanManageMaintenance(user, maintenance);

        if(maintenance.status !== 'Pending') {
            throw new BadRequestException("Only pending maintenance tickets can be started");
        }

        const updatedMaintenance = await this.prisma.maintenance.update({
            where: { id },
            data: {
                status: 'InProgress',
                startedAt: new Date()
            }
        })

        return updatedMaintenance;
    }

    async completeMaintenance(user: UserSession, id: string, body: CompleteMaintenanceDto) {
        const maintenance = await this.findOrThrow(id);
        this.assertCanManageMaintenance(user, maintenance);

        if(maintenance.status !== 'InProgress') {
            throw new BadRequestException("Only in-progress maintenance tickets can be resolved");
        }

        const updatedMaintenance = await this.prisma.maintenance.update({
            where: { id },
            data: {
                status: 'Completed',
                resolutionNotes: body.resolutionNotes,
                resolutionProofImages: body.resolutionProofImages,
                resolvedAt: new Date()
            }
        })

        return updatedMaintenance;
    }

    async closeMaintenance(id: string) {
        const maintenance = await this.findOrThrow(id);

        if(maintenance.status !== 'Completed') {
            throw new BadRequestException("Only completed maintenance tickets can be closed");
        }

        const updatedMaintenance = await this.prisma.maintenance.update({
            where: { id },
            data: {
                status: 'Closed',
            }
        })

        return updatedMaintenance;
    }

    async getAssignedActiveMaintenances(user: UserSession, query: GetMaintenanceDto) {
        return this.getAssignedMaintenances(user, query, ['Pending', 'InProgress']);
    }

    async getAssignedMaintenanceHistory(user: UserSession, query: GetMaintenanceDto) {
        return this.getAssignedMaintenances(user, query, ['Completed', 'Closed']);
    }

    async getAssignedMaintenanceSummary(user: UserSession, query: GetMaintenanceDto) {
        const where = this.getAssignedMaintenanceWhere(user, query, ['Pending', 'InProgress']);
        const highPriorityQuery = query.priority && query.priority !== 'High'
            ? Promise.resolve(0)
            : this.prisma.maintenance.count({ where: { ...where, priority: 'High' } });
        const [statusCounts, highPriority] = await Promise.all([
            this.prisma.maintenance.groupBy({
                by: ['status'],
                where,
                _count: { status: true },
            }),
            highPriorityQuery,
        ]);

        const summaryByStatus: Partial<Record<MaintenanceStatus, number>> = {};
        for (const item of statusCounts) {
            summaryByStatus[item.status as MaintenanceStatus] = item._count.status;
        }

        return {
            pending: summaryByStatus[MaintenanceStatus.Pending] ?? 0,
            inProgress: summaryByStatus[MaintenanceStatus.InProgress] ?? 0,
            highPriority,
        };
    }

    async getAssignedMaintenanceById(user: UserSession, id: string) {
        const maintenance = await this.prisma.maintenance.findFirst({
            where: {
                id,
                assignedToId: user.id,
            },
            include: {
                report: {
                    select: {
                        id: true,
                        bookingId: true,
                        type: true,
                        createdAt: true,
                        booking: {
                            select: {
                                id: true,
                                referenceCode: true,
                                guestName: true,
                                bookingDate: true,
                                accommodation: {
                                    select: {
                                        id: true,
                                        name: true,
                                        type: true,
                                    },
                                },
                            },
                        },
                    },
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        expertise: true,
                    },
                },
            },
        });

        if (!maintenance) {
            throw new NotFoundException('Maintenance ticket not found');
        }

        return maintenance;
    }

    private async findOrThrow(id: string) {
       const maintenance = await this.prisma.maintenance.findUnique({ where: { id } });
        if (!maintenance) throw new NotFoundException("Maintenance ticket not found");

        return maintenance;
    }

    private async getAssignedMaintenances(
        user: UserSession,
        query: GetMaintenanceDto,
        statuses: MaintenanceStatus[],
    ) {
        const { page = 1, limit = 10 } = query;
        const where = this.getAssignedMaintenanceWhere(user, query, statuses);

        const [data, total] = await Promise.all([
            this.prisma.maintenance.findMany({
                where,
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            expertise: true,
                        },
                    },
                },
                ...getPaginationArgs(page, limit),
                orderBy: [
                    { updatedAt: 'desc' },
                    { createdAt: 'desc' },
                ],
            }),
            this.prisma.maintenance.count({ where }),
        ]);

        return {
            data,
            meta: getPaginationMeta(total, page, limit),
        };
    }

    private getAssignedMaintenanceWhere(
        user: UserSession,
        query: GetMaintenanceDto,
        statuses: MaintenanceStatus[],
    ): Prisma.MaintenanceWhereInput {
        const { search, status, priority } = query;
        const scopedStatus = status
            ? statuses.includes(status) ? status : { in: [] }
            : { in: statuses };

        return {
            assignedToId: user.id,
            status: scopedStatus,
            ...(priority ? { priority } : {}),
            ...(search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { id: { contains: search, mode: 'insensitive' } },
                ],
            } : {}),
        };
    }

    private assertCanManageMaintenance(
        user: UserSession,
        maintenance: { assignedToId: string | null },
    ) {
        if (user.role === Role.ADMIN) {
            return;
        }

        if (user.role !== Role.MAINTENANCE_STAFF || maintenance.assignedToId !== user.id) {
            throw new BadRequestException('You are not allowed to update this maintenance ticket');
        }
    }

    async selectAssignee(expertise: MaintenanceExpertise) {
        const candidates = await this.prisma.user.findMany({
            where: {
                role: Role.MAINTENANCE_STAFF,
                status: UserStatus.ACTIVE,
                expertise,
            },
            select: {
                id: true,
                createdAt: true,
                assignedMaintenances: {
                    where: {
                        status: {
                            not: MaintenanceStatus.Closed,
                        },
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });

        candidates.sort((left, right) => {
            const workloadDiff =
                left.assignedMaintenances.length - right.assignedMaintenances.length;

            if (workloadDiff !== 0) {
                return workloadDiff;
            }

            return left.createdAt.getTime() - right.createdAt.getTime();
        });

        return candidates[0]?.id ?? null;
    }
}
