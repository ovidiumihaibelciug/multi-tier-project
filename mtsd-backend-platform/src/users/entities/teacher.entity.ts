import { ChildEntity, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Course } from 'src/courses/entities/course.entity';

@ChildEntity('TEACHER')
export class Teacher extends User {
  @OneToMany(() => Course, (course) => course.teacher)
  taughtCourses: Course[];
}
