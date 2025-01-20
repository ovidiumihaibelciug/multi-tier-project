import { Module } from '@nestjs/common';

import { QuizzesController } from './quizzes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';

import { SubmissionsService } from './services/submissions.service';
import { QuizzesService } from './services/quizzes.service';
import { Submission } from './entities/submission.entity';
import { Answer } from './entities/submitted-answer.entity';
import { Student } from 'src/users/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Submission, Answer, Student, Question]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService, SubmissionsService],
})
export class QuizzesModule {}
