import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/lib/decorators/Roles.decorator';
import { User, UserSession } from 'src/lib/decorators/User.decorator';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RolesGuard } from 'src/lib/guards/Roles.guard';
import {
  CreateKnowledgeDocumentDto,
  GetKnowledgeDocumentsQuery,
  UpdateKnowledgeDocumentDto,
} from './dto/knowledge.dto';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  list(@Query() query: GetKnowledgeDocumentsQuery) {
    return this.knowledgeService.list(query);
  }

  @Post()
  create(@User() user: UserSession, @Body() body: CreateKnowledgeDocumentDto) {
    return this.knowledgeService.create(user.id, body);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.knowledgeService.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateKnowledgeDocumentDto) {
    return this.knowledgeService.update(id, body);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.knowledgeService.publish(id);
  }

  @Post(':id/unpublish')
  unpublish(@Param('id') id: string) {
    return this.knowledgeService.unpublish(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.knowledgeService.remove(id);
  }
}
