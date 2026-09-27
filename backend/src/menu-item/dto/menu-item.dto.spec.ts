import { BadRequestException } from '@nestjs/common';
import { CustomValidationPipe } from 'src/CustomValidationPipe';
import { CreateMenuItemDto } from './menu-item.dto';

describe('CreateMenuItemDto category validation', () => {
  const pipe = new CustomValidationPipe();

  const validMenuItem = {
    imageUrl: 'https://example.com/menu-item.jpg',
    name: 'Grilled Fish',
    description: 'Fresh grilled fish',
    price: 450,
    availability: 'Available',
  };

  it('normalizes whitespace and casing to title case', async () => {
    const dto = await pipe.transform(
      { ...validMenuItem, category: '  mAIN    dishes  ' },
      { type: 'body', metatype: CreateMenuItemDto },
    );

    expect(dto.category).toBe('Main Dishes');
  });

  it('rejects a blank category with the menu-specific message', async () => {
    try {
      await pipe.transform(
        { ...validMenuItem, category: '   ' },
        { type: 'body', metatype: CreateMenuItemDto },
      );
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        errors: [
          {
            field: 'category',
            message: ['Choose or create a category.'],
          },
        ],
      });
      return;
    }

    throw new Error('Expected blank category validation to fail');
  });
});
