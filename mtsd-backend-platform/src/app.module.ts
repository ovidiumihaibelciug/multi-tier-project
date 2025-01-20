import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { CoursesModule } from './courses/courses.module';
import { ChatsModule } from './chats/chats.module';
import { AnnouncementsModule } from './announcements/announcements.module';

@Module({
  imports: [
    DatabaseModule,
    CoursesModule,
    QuizzesModule,
    ProjectsModule,
    UsersModule,
    ChatsModule,
    AnnouncementsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // Reflector,
  ],
})
export class AppModule {}
