import { Announcement } from 'src/announcements/entities/announcement.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  credits: number;

  @Column({ nullable: true })
  schedule: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  maxStudents: number;

  @Column({ nullable: true, type: 'simple-json' })
  resources: string[];

  @Column({ nullable: true, default: 'ACTIVE' })
  state: string;

  @Column({ nullable: true, type: 'simple-json' })
  syllabus: { week: number; topic: string; content: string }[];

  @ManyToOne(() => Teacher, (teacher) => teacher.taughtCourses)
  teacher: Teacher;

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];

  @ManyToMany(() => Student)
  @JoinTable()
  students: Student[];

  @OneToMany(() => Announcement, (announcement) => announcement.course)
  announcements: Announcement[];
}
