import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SubmissionsService } from './services/submissions.service';
import { QuizzesService } from './services/quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }

  @Post('submit')
  async submitQuiz(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionsService.create(createSubmissionDto);
  }

  @Get(':quizId/submissions')
  async getSubmissionsForQuiz(@Param('quizId') quizId: string) {
    return this.submissionsService.findAllByQuizId(quizId);
  }

  @Get(':quizId/submissions/:submissionId')
  async getSubmission(
    @Param('quizId') quizId: string,
    @Param('submissionId') submissionId: string,
  ) {
    return this.submissionsService.findOne(submissionId, quizId);
  }
}
