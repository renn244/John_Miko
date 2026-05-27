import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ClosureService } from './closure.service';
import { CreateClosureDto } from './dto/create-closure.dto';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import { Roles } from 'src/lib/decorators/Roles.decorator';

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
    async getClosures(@Query() query: { accommodationId?: string }) {
        return this.closureService.getClosures(query.accommodationId);
    }

    @Roles('ADMIN')
    @Delete(':closureId')
    async deleteClosure(@Param('closureId') closureId: string) {
        return this.closureService.deleteClosure(closureId);
    }
}