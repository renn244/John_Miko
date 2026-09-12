import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { getSingleDayRange } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { GetFeedbackQuery } from './query/getFeedback.query';

@Injectable()
export class FeedbackService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createFeedback(user: UserSession, body: CreateFeedbackDto) {
        const booking = await this.prisma.booking.findUnique({ 
            where: { id: body.bookingId },
        });
    
        if(!booking) {
            throw new NotFoundException('Booking not found');
        }

        if(!booking.userId || booking.userId !== user.id) {
            throw new ForbiddenException('You can only leave feedback for your own bookings');
        }

        if (booking.status !== 'Completed' && booking.status !== 'Cancelled') {
            throw new BadRequestException('Feedback is available only for completed or cancelled bookings');
        }

        const feedback = await this.prisma.feedback.create({
            data: {
                userId: user.id,
                bookingId: body.bookingId,
                rating: body.rating,
                comment: body.comment,
            }
        })

        return feedback;
    }

    async getFeedbacks(query: GetFeedbackQuery) {
        const { search, page, limit } = cleanPrismaWhere(query);

        const where: Prisma.FeedbackWhereInput = {
            OR: [
                { id: { contains: search, mode: 'insensitive' } },
                { comment: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
            ]
        } 

        const [data, total] = await Promise.all([
            this.prisma.feedback.findMany({
                where: where,
                include: {
                    booking: {
                        select: {
                            referenceCode: true,
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                ...getPaginationArgs(page, limit)
            }),
            this.prisma.feedback.count({ where: where })
        ]);

        return {
            data,
            meta: getPaginationMeta(total, page, limit)
        };
    }

    async getFeedbackReport(date?: Date) {
        const { gte, lte } = getSingleDayRange(date);
    
        const [receivedOnDate, averageOnDate, distributionOnDate] = await Promise.all([
            this.prisma.feedback.count({ where: { createdAt: { lte, gte } } }),
            this.prisma.feedback.aggregate({ where: { createdAt: { lte, gte } }, _avg: { rating: true } }),
            this.prisma.feedback.groupBy({
                where: {
                    createdAt: { gte, lte }
                },
                by: ['rating'],
                _count: true,
            })
        ])

        return {
            receivedOnDate,
            averageOnDate: averageOnDate._avg.rating || 0,
            distribution: distributionOnDate.map((item) => ({
                rating: item.rating,
                count: item._count,
            })),
        }
    }

    async getFeedbackStats() {
        const stats = await this.prisma.feedback.aggregate({
            _count: true,
            _avg: { rating: true },
            _min: { rating: true },
            _max: { rating: true },
        });

        return {
            total: stats._count,
            averageRating: stats._avg.rating || 0,
            minRating: stats._min.rating || 0,
            maxRating: stats._max.rating || 0,
        };
    }

    async getOverview(date?: Date) {
        const { gte, lte } = getSingleDayRange(date);
        const feedbackSummaryInclude = {
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
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        } satisfies Prisma.FeedbackInclude;

        const [stats, receivedToday, recentFeedback, lowRatingFeedback] =
            await Promise.all([
                this.prisma.feedback.aggregate({
                    _count: true,
                    _avg: { rating: true },
                    _min: { rating: true },
                    _max: { rating: true },
                }),
                this.prisma.feedback.count({
                    where: { createdAt: { gte, lte } },
                }),
                this.prisma.feedback.findMany({
                    include: feedbackSummaryInclude,
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.feedback.findMany({
                    where: { rating: { lte: 3 } },
                    include: feedbackSummaryInclude,
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                }),
            ]);

        return {
            total: stats._count,
            averageRating: stats._avg.rating || 0,
            minRating: stats._min.rating || 0,
            maxRating: stats._max.rating || 0,
            receivedToday,
            recentFeedback,
            lowRatingFeedback,
        };
    }

    async getFeedbackById(id: string, user: UserSession) {
        const feedback = await this.prisma.feedback.findUnique({
            where: { id },
            include: {
                booking: {
                    select: {
                        referenceCode: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
            }
        })

        if(!feedback) {
            throw new NotFoundException('Feedback not found');
        }

        if(user.role === "GUEST" && feedback.userId !== user.id) {
            throw new ForbiddenException('You can only view your own feedback')
        }

        return feedback;
    }

    async updateFeedback(id: string, user: UserSession, body: UpdateFeedbackDto) {
        const feedback = await this.prisma.feedback.findUnique({
            where: { id },
        })

        if(!feedback) {
            throw new NotFoundException('Feedback not found');
        }

        if(feedback.userId !== user.id) {
            throw new ForbiddenException('You can only update your own feedback');
        }

        const updatedFeedback = await this.prisma.feedback.update({
            where: { id },
            data: {
                rating: body.rating,
                comment: body.comment,
            }
        });

        return updatedFeedback;
    }

    async deleteFeedback(id: string, user: UserSession) {
        const feedback = await this.prisma.feedback.findUnique({
            where: { id },
        })

        if(!feedback) {
            throw new NotFoundException('Feedback not found');
        }

        if(feedback.userId !== user.id) {
            throw new ForbiddenException('You can only delete your own feedback');
        }

        const deletedFeedback = await this.prisma.feedback.delete({
            where: { id },
        });

        return deletedFeedback;
    }
}
