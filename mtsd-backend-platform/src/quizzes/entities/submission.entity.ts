import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Quiz } from './quiz.entity';

import { Answer } from './submitted-answer.entity';
import { Student } from 'src/users/entities/student.entity';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions)
  quiz: Quiz;

  @ManyToOne(() => Student, (user) => user.submissions)
  student: Student;

  @OneToMany(() => Answer, (answer) => answer.submission, { cascade: true })
  answers: Answer[];

  @Column({ nullable: true })
  score: number;

  @CreateDateColumn()
  submittedAt: Date;
}
