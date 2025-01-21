import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Announcement } from 'src/announcements/entities/announcement.entity';
import { Student } from 'src/users/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, User, Announcement, Student, Teacher]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
