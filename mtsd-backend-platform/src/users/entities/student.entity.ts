import { Course } from 'src/courses/entities/course.entity';

import { OneToMany, ManyToMany, ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Submission } from 'src/quizzes/entities/submission.entity';

@ChildEntity('STUDENT')
export class Student extends User {
  @OneToMany(() => Submission, (submission) => submission.student)
  submissions: Submission[];

  @ManyToMany(() => Course, (course) => course.students)
  courses: Course[];

  @OneToMany(() => Project, (project) => project.student)
  projects: Project[];
}
