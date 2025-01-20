import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/users/entities/user.entity';

export class CourseSeeder implements Seeder {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    // Check if courses already exist
    const existingCourses = await this.courseRepository.count();
    if (existingCourses > 0) return;

    // Get teacher and student users by their roles
    const teacher = await this.userRepository.findOne({
      where: { type: 'TEACHER' },
    });
    const student = await this.userRepository.findOne({
      where: { type: 'STUDENT' },
    });

    if (!teacher || !student) {
      throw new Error('Teacher or Student user not found. Seed users first.');
    }

    // Create courses
    const courses = [
      this.courseRepository.create({
        title: 'Math 101',
        description:
          'Introduction to Mathematics, covering basic algebra and geometry.',
        credits: 4,
        schedule: 'Mon, Wed, Fri 9:00 AM - 10:30 AM',
        location: 'Math Building, Room 101',
        maxStudents: 30,
        resources: [
          'Algebra for Beginners by John Doe',
          'Basic Geometry Textbook by Jane Smith',
        ],
        syllabus: [
          {
            week: 1,
            topic: 'Basic Algebra',
            content:
              'Understanding variables, equations, and simple algebraic expressions.',
          },
          {
            week: 2,
            topic: 'Geometry Basics',
            content:
              'Introduction to shapes, angles, and the Pythagorean theorem.',
          },
          {
            week: 3,
            topic: 'Graphs and Functions',
            content: 'Graphing linear equations and understanding functions.',
          },
        ],
        state: 'ACTIVE',
        teacher: teacher,
        students: [student],
      }),
      this.courseRepository.create({
        title: 'Physics 101',
        description:
          'An introductory course in Physics, focusing on classical mechanics.',
        credits: 4,
        schedule: 'Tue, Thu 10:00 AM - 12:00 PM',
        location: 'Physics Building, Room 202',
        maxStudents: 25,
        resources: [
          'Physics for Scientists and Engineers by Serway',
          'Basic Concepts of Mechanics by Halliday',
        ],
        syllabus: [
          {
            week: 1,
            topic: 'Introduction to Physics',
            content:
              'Understanding fundamental concepts such as motion and force.',
          },
          {
            week: 2,
            topic: 'Newton’s Laws of Motion',
            content:
              'Detailed exploration of Newton’s three laws and their applications.',
          },
          {
            week: 3,
            topic: 'Work and Energy',
            content: 'Concepts of work, energy, and conservation laws.',
          },
        ],
        state: 'ACTIVE',
        teacher: teacher,
        students: [student],
      }),
    ];

    // Save courses
    for (const course of courses) {
      await this.courseRepository.save(course);
    }
  }

  async drop(): Promise<void> {
    await this.courseRepository.clear();
  }
}
