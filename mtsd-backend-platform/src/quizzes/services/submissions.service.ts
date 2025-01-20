import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/users/entities/student.entity';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { Submission } from '../entities/submission.entity';
import { Quiz } from '../entities/quiz.entity';
import { Answer } from '../entities/submitted-answer.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,

    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    const { quizId, studentId, answers, score } = createSubmissionDto;

    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    if (answers.length !== quiz.questions.length) {
      throw new Error(
        `Number of answers (${answers.length}) does not match the number of questions (${quiz.questions.length}) in the quiz.`,
      );
    }

    const submission = this.submissionRepository.create({
      quiz,
      student,
      score,
    });
    const savedSubmission = await this.submissionRepository.save(submission);

    const answerEntities = answers.map((selectedAnswer, index) => {
      const question = quiz.questions[index];
      const isCorrect = question.correctAnswers.includes(selectedAnswer);

      return this.answerRepository.create({
        question,
        submission: savedSubmission,
        content: selectedAnswer,
        selectedChoices: [selectedAnswer],
        isCorrect,
      });
    });

    await this.answerRepository.save(answerEntities);

    return this.submissionRepository.findOne({
      where: { id: savedSubmission.id },
      relations: ['answers', 'quiz', 'student'],
    });
  }

  async findAllByQuizId(quizId: string): Promise<Submission[]> {
    return this.submissionRepository.find({
      where: { quiz: { id: quizId } },
      relations: ['quiz', 'student', 'answers'],
    });
  }

  async findOne(submissionId: string, quizId: string): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId, quiz: { id: quizId } },
      relations: ['quiz', 'student', 'answers'],
    });

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} for quiz ${quizId} not found`,
      );
    }

    return submission;
  }
}
