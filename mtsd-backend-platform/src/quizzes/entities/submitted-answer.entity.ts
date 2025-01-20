import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity';
import { Submission } from './submission.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  content: string;

  @Column()
  isCorrect: boolean;

  @Column('simple-array', { nullable: true })
  selectedChoices: string[];

  @ManyToOne(() => Submission, (submission) => submission.answers)
  submission: Submission;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
}
