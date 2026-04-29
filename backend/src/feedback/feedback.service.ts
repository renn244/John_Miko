import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { UserSession } from 'src/lib/decorators/User.decorator';
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

        if(booking.userId !== user.id) {
            throw new ForbiddenException('You can only leave feedback for your own bookings');
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

    async getFeedbackStats() {
        const totalFeedbacks = await this.prisma.feedback.aggregate({
            _count: true,
            _avg: { rating: true },
            _min: { rating: true },
            _max: { rating: true },
        });

        return {
            total: totalFeedbacks._count,
            averageRating: totalFeedbacks._avg.rating?.toFixed(2),
            minRating: totalFeedbacks._min.rating,
            maxRating: totalFeedbacks._max.rating,
        }
    }

    async getFeedbackById(id: string) {
        const feedback = await this.prisma.feedback.findUnique({
            where: { id },
            include: {
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
