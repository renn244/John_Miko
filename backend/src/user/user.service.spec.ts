import { UserService } from './user.service';

describe('UserService', () => {
  const prisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  const service = new UserService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses a canonical email for lookups and guest creation', async () => {
    await service.findUserByEmail('  Nico@Example.COM ');
    await service.createUserGuest({
      email: '  Nico@Example.COM ',
      name: 'Nico',
      contactNo: '09171234567',
      password: 'HashedPassword123!',
      confirmPassword: 'HashedPassword123!',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'nico@example.com' } });
    expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ email: 'nico@example.com' }),
    }));
  });
});
