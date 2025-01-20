import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { Course } from 'src/courses/entities/course.entity';

export class AnnouncementSeeder implements Seeder {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async seed(): Promise<void> {
    // Check if announcements already exist
    const existingAnnouncements = await this.announcementRepository.count();
    if (existingAnnouncements > 0) return;

    // Fetch courses
    const courses = await this.courseRepository.find();

    // Create unique announcements
    const announcements = [
      // General announcements
      this.announcementRepository.create({
        title: 'Campus Maintenance Alert',
        content:
          'Campus maintenance will take place on Saturday from 8:00 AM to 6:00 PM. Some facilities may be unavailable during this time.',
        isUrgent: true,
      }),
      this.announcementRepository.create({
        title: 'Student Orientation Event',
        content:
          'Join us for the Student Orientation on Monday at the Main Auditorium to learn about campus resources and meet faculty members.',
        isUrgent: false,
      }),
      this.announcementRepository.create({
        title: 'Research Grants Application',
        content:
          'Applications for the annual research grants are now open. Submit your proposals by the end of this month.',
        isUrgent: false,
      }),
      this.announcementRepository.create({
        title: 'Library Renovation Notice',
        content:
          'The library will undergo renovations starting next week. Temporary study spaces will be arranged in the Science Building.',
        isUrgent: false,
      }),
      this.announcementRepository.create({
        title: 'Coding Bootcamp Registration',
        content:
          'Register now for the upcoming Coding Bootcamp! Enhance your programming skills with hands-on projects.',
        isUrgent: false,
      }),

      // Course-specific announcements
      ...courses.map((course, index) =>
        this.announcementRepository.create({
          title: `Update for ${course.title}`,
          content: `Attention students of ${course.title}, please check the updated syllabus and prepare for the upcoming midterm exam.`,
          isUrgent: index % 2 === 0, // Alternate urgency for course announcements
          course,
        }),
      ),
    ];

    // Limit to exactly 10 announcements, adding more general ones if needed
    while (announcements.length < 10) {
      announcements.push(
        this.announcementRepository.create({
          title: 'Hackathon Participation Open',
          content:
            'Form your teams and participate in the upcoming university hackathon. Exciting prizes await!',
          isUrgent: false,
        }),
      );
    }

    // Save announcements
    for (const announcement of announcements) {
      await this.announcementRepository.save(announcement);
    }
  }

  async drop(): Promise<void> {
    await this.announcementRepository.clear();
  }
}
