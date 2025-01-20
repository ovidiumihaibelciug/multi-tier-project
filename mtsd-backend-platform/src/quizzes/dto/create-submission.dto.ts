import { Answer } from '../entities/submitted-answer.entity';

export class CreateSubmissionDto {
  studentId: string;
  quizId: string;
  answers: string[];
  score: number;
}
