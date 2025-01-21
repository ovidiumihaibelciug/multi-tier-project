import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsService } from './announcements.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { Course } from '../courses/entities/course.entity';

const mockAnnouncementRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockCourseRepository = {
  findOne: jest.fn(),
};

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all announcements', async () => {
    const mockAnnouncements = [
      { id: '1', title: 'Test', content: 'Test Content' },
    ];
    mockAnnouncementRepository.find.mockResolvedValue(mockAnnouncements);

    const result = await service.findAll();
    expect(mockAnnouncementRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockAnnouncements);
  });

  it('should create a new announcement', async () => {
    const mockCourse = { id: 1, title: 'Test Course' };
    const createDto = {
      title: 'New Announcement',
      content: 'Content',
      courseId: 1,
      isUrgent: false,
    };
    const savedAnnouncement = { id: '1', ...createDto };

    mockCourseRepository.findOne.mockResolvedValue(mockCourse);
    mockAnnouncementRepository.create.mockReturnValue(savedAnnouncement);
    mockAnnouncementRepository.save.mockResolvedValue(savedAnnouncement);

    const result = await service.create(createDto);
    expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(mockAnnouncementRepository.save).toHaveBeenCalledWith(
      savedAnnouncement,
    );
    expect(result).toEqual(savedAnnouncement);
  });
});
