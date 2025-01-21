import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserByIdentifier', () => {
    it('should return the user if found', async () => {
      const user = { email: 'test@example.com' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findUserByIdentifier('test@example.com');

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: 'test@example.com' }],
      });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findUserByIdentifier(
        'nonexistent@example.com',
      );

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: 'nonexistent@example.com' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return the user if found', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update the user successfully', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;
      const updateUserDto = { email: 'updated@example.com' };

      jest.spyOn(service, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue({ ...user, ...updateUserDto } as User);

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual({ ...user, ...updateUserDto });
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        ...updateUserDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove the user successfully', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(user);

      await service.remove('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(userRepository.remove).toHaveBeenCalledWith(user);
    });
  });
});
