import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { ClosureService } from './closure.service';
import { CreateClosureDto } from './dto/create-closure.dto';
import { GetClosureByDateQueryDto } from './query/getClosureByDate.query';
import { getClosuresQueryDto } from './query/getClosures.query';

@Controller('closure')
@UseGuards(AuthGuard, RolesGuard)
export class ClosureController {
    constructor(
        private readonly closureService: ClosureService
    ) {}

    @Roles('ADMIN')    
    @Post()
    async createClosure(@Body() body: CreateClosureDto) {
        return this.closureService.createClosure(body);
    }

    @Get()
    async getClosures(@Query() query: getClosuresQueryDto) {
        return this.closureService.getClosures(query.mode, query.accommodationId);
    }

    @Get('byDate')
    async getClosureByDate(@Query() query: GetClosureByDateQueryDto) {
        return this.closureService.getClosureByDate(query);
    }

    @Roles('ADMIN')
    @Delete(':closureId')
    async deleteClosure(@Param('closureId') closureId: string) {
        return this.closureService.deleteClosure(closureId);
    }
}