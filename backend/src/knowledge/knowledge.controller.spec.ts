import { ArgumentMetadata } from '@nestjs/common';
import { CustomValidationPipe } from 'src/CustomValidationPipe';
import { Role } from 'src/generated/prisma/enums';
import { ROLES_KEY } from 'src/lib/decorators/Roles.decorator';
import { CreateKnowledgeDocumentDto } from './dto/knowledge.dto';
import { KnowledgeController } from './knowledge.controller';

describe('KnowledgeController', () => {
  const knowledgeService = {
    create: jest.fn(),
    list: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    publish: jest.fn(),
    unpublish: jest.fn(),
    remove: jest.fn(),
  };
  const controller = new KnowledgeController(knowledgeService as never);

  beforeEach(() => jest.clearAllMocks());

  it('requires the ADMIN role for the whole controller', () => {
    expect(Reflect.getMetadata(ROLES_KEY, KnowledgeController)).toEqual([
      Role.ADMIN,
    ]);
  });

  it('creates a document for the authenticated admin', async () => {
    const body = {
      title: 'Guide',
      category: 'Policies',
      contentHtml: '<p>Welcome</p>',
      contentText: 'Welcome',
    };
    await controller.create(
      { id: 'admin-1', email: 'admin@example.com', role: Role.ADMIN },
      body,
    );
    expect(knowledgeService.create).toHaveBeenCalledWith('admin-1', body);
  });

  it('sanitizes knowledge HTML at the DTO boundary', async () => {
    const pipe = new CustomValidationPipe();
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateKnowledgeDocumentDto,
      data: '',
    };

    const result = await pipe.transform(
      {
        title: 'Guide',
        category: 'Policies',
        contentHtml: '<p>Welcome</p><script>bad()</script>',
        contentText: '  Welcome  ',
      },
      metadata,
    );

    expect(result.contentHtml).toBe('<p>Welcome</p>');
    expect(result.contentText).toBe('  Welcome  ');
  });

  it('delegates publish, unpublish, and delete to one service', async () => {
    await controller.publish('document-1');
    await controller.unpublish('document-1');
    await controller.remove('document-1');
    expect(knowledgeService.publish).toHaveBeenCalledWith('document-1');
    expect(knowledgeService.unpublish).toHaveBeenCalledWith('document-1');
    expect(knowledgeService.remove).toHaveBeenCalledWith('document-1');
  });
});
