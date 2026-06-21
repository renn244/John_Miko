import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { FeedbackService } from './feedback.service';
import { GetFeedbackQuery } from './query/getFeedback.query';
import { GetFeedbackAnalyticsQuery } from './query/getFeedbackAnalytics.query';

@Controller('feedback')
@UseGuards(AuthGuard, RolesGuard)
export class FeedbackController {
    constructor(
        private readonly feedbackService: FeedbackService
    ) {}

    @Roles(Role.GUEST)
    @Post()
    async createFeedback(@User() user: UserSession, @Body() body: CreateFeedbackDto) {
        return this.feedbackService.createFeedback(user, body);
    }

    @Roles(Role.ADMIN)
    @Get()
    async getFeedbacks(@Query() query: GetFeedbackQuery) {
        return this.feedbackService.getFeedbacks(query);
    }

    @Roles(Role.ADMIN)
    @Get('analytics')
    async getAnalytics(@Query() query: GetFeedbackAnalyticsQuery) {
        return this.feedbackService.getAnalytics(query);
    }

    @Roles(Role.ADMIN)
    @Get('count-per-rating')
    async getCountPerRating(@Query() query: GetFeedbackAnalyticsQuery) {
        return this.feedbackService.getCountPerRating(query);
    }

    @Roles(Role.ADMIN)
    @Get('report')
    async getFeedbackReport() {
        return this.feedbackService.getFeedbackReport();
    }

    @Roles(Role.ADMIN)
    @Get('stats')
    async getFeedbackStats() {
        return this.feedbackService.getFeedbackStats();
    }

    @Roles(Role.GUEST, Role.ADMIN)
    @Get(':id')
    async getFeedbackById(@Param('id') id: string, @User() user: UserSession) {
        return this.feedbackService.getFeedbackById(id, user);
    }

    @Roles(Role.GUEST)
    @Patch(':id')
    async updateFeedback(@Param('id') id: string, @User() user: UserSession, @Body() body: UpdateFeedbackDto) {
        return this.feedbackService.updateFeedback(id, user, body);
    }

    @Roles(Role.GUEST)  
    @Delete(':id')
    async deleteFeedback(@Param('id') id: string, @User() user: UserSession) {
        return this.feedbackService.deleteFeedback(id, user);
    }
}
