import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { Course } from '../courses/entities/course.entity';

const mockAnnouncementRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockCourseRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('AnnouncementsController', () => {
  let controller: AnnouncementsController;
  let service: AnnouncementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(Announcement),
          useValue: mockAnnouncementRepository,
        },
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
      ],
    }).compile();

    controller = module.get<AnnouncementsController>(AnnouncementsController);
    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all announcements', async () => {
    const announcements = [{ id: '1', title: 'Test', content: 'Test content' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(announcements as any);

    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(announcements);
  });

  it('should create a new announcement', async () => {
    const dto = {
      title: 'New',
      content: 'Content',
      courseId: 1,
      isUrgent: false,
    };
    const createdAnnouncement = { id: '1', ...dto };
    jest.spyOn(service, 'create').mockResolvedValue(createdAnnouncement as any);

    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(createdAnnouncement);
  });
});
