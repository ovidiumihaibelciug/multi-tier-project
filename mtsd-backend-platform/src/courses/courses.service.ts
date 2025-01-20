import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const {
      title,
      description,
      credits,
      schedule,
      location,
      maxStudents,
      resources,
      syllabus,
      teacherId,
      studentIds,
    } = createCourseDto;

    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    let students = [];
    if (studentIds && studentIds.length > 0) {
      students = await this.userRepository.findByIds(studentIds);
    }

    console.log('students', students);
    console.log('teacher', teacher);

    const course = this.courseRepository.create({
      title,
      description,
      credits,
      schedule,
      location,
      maxStudents,
      resources,
      syllabus,
      teacher,
      students,
    });

    return this.courseRepository.save(course);
  }

  /**
   * Get all courses
   * @returns Promise<Course[]>
   */
  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  /**
   * Get a course by ID
   * @param id - Course ID
   * @returns Promise<Course>
   */
  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['teacher', 'students'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  /**
   * Update a course by ID
   * @param id - Course ID
   * @param updateCourseDto - Data Transfer Object for updating a course
   * @returns Promise<Course>
   */
  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  /**
   * Delete a course by ID
   * @param id - Course ID
   * @returns Promise<void>
   */
  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }
}
