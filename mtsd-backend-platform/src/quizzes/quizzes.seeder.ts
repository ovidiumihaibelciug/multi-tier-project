import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Question } from './entities/question.entity';

export class QuizSeeder implements Seeder {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async seed(): Promise<void> {
    const existingQuizzes = await this.quizRepository.count();
    if (existingQuizzes > 0) return;

    const courses = await this.courseRepository.find();
    if (courses.length === 0) {
      throw new Error('No courses found. Seed courses first.');
    }

    const quizzes = [
      {
        title: 'Algebra Basics Quiz',
        description: 'A quiz covering basic algebra concepts.',
        duration: 30,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        isPractice: false,
        course: courses[0],
        questions: [
          {
            content: 'What is 2 + 2?',
            type: 'multiple-choice',
            choices: ['2', '3', '4', '5'],
            correctAnswers: ['4'],
          },
          {
            content: 'Solve: 3x = 9. What is x?',
            type: 'multiple-choice',
            choices: ['1', '2', '3', '4'],
            correctAnswers: ['3'],
          },
        ],
      },
      {
        title: 'Physics Mechanics Practice Quiz',
        description:
          'A practice quiz covering Newton’s laws and basic mechanics.',
        duration: 45,
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        isActive: true,
        isPractice: true,
        course: courses[1],
        questions: [
          {
            content: 'What is the first law of motion?',
            type: 'text',
            choices: [],
            correctAnswers: [
              'An object in motion stays in motion unless acted upon by an external force.',
            ],
          },
          {
            content: 'What is the acceleration due to gravity on Earth?',
            type: 'multiple-choice',
            choices: ['8.9 m/s²', '9.8 m/s²', '10.2 m/s²'],
            correctAnswers: ['9.8 m/s²'],
          },
        ],
      },
    ];

    for (const quizData of quizzes) {
      const { questions, ...quizFields } = quizData;

      const quiz = this.quizRepository.create(quizFields);
      const savedQuiz = await this.quizRepository.save(quiz);

      for (const questionData of questions) {
        const question = this.questionRepository.create({
          ...questionData,
          quiz: savedQuiz,
        });
        await this.questionRepository.save(question);
      }
    }
  }

  async drop(): Promise<void> {
    await this.questionRepository.clear();
    await this.quizRepository.clear();
  }
}
