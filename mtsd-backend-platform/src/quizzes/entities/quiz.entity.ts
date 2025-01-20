import { Course } from 'src/courses/entities/course.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Question } from './question.entity';
import { Submission } from './submission.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: number; // in minutes

  @Column()
  startDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPractice: boolean;

  @ManyToOne(() => Course, (course) => course.quizzes)
  course: Course;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @OneToMany(() => Submission, (submission) => submission.quiz)
  submissions: Submission[];
}
