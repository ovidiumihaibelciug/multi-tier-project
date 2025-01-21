import { Student } from 'src/users/entities/student.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  deadline: Date;

  @Column()
  state: string;

  @ManyToOne(() => Student, (student) => student.projects)
  @JoinColumn()
  student: Student;
}
