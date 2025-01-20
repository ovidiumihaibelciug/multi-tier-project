import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UserSeeder } from './users/user.seeder';

import { Teacher } from './users/entities/teacher.entity';
import { Administrator } from './users/entities/administrator.entity';
import { Student } from './users/entities/student.entity';
import { Submission } from './quizzes/entities/submission.entity';
import { Project } from './projects/entities/project.entity';
import { Quiz } from './quizzes/entities/quiz.entity';
import { Question } from './quizzes/entities/question.entity';
import { Answer } from './quizzes/entities/submitted-answer.entity';
import { CourseSeeder } from './courses/course.seeder';
import { Course } from './courses/entities/course.entity';
import { QuizSeeder } from './quizzes/quizzes.seeder';
import { ChatSeeder } from './chats/chats.seeder';
import { Chat } from './chats/entities/chat.entity';
import { Message } from './chats/entities/message.entity';
import { Announcement } from './announcements/entities/announcement.entity';
import { AnnouncementSeeder } from './announcements/announcements.seeder';

async function bootstrap() {
  await seeder({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USERNAME || 'postgres',
        password: 'admin',
        database: process.env.POSTGRES_NAME || 'mtsd',
        entities: [
          User,
          Quiz,
          Question,
          Answer,
          Submission,
          Project,
          Teacher,
          Administrator,
          Student,
          Course,
          Chat,
          Message,
          Announcement,
        ],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([
        User,
        Chat,
        Course,
        Quiz,
        Question,
        Message,
        Announcement,
      ]),
    ],
  }).run([
    UserSeeder,
    ChatSeeder,
    CourseSeeder,
    QuizSeeder,
    AnnouncementSeeder,
  ]);
}

bootstrap();
