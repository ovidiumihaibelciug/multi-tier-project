import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { type } from 'os';

export class UserSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<any> {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) return;

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('user', 10),
        type: 'ADMIN',
      },
      {
        name: 'Teacher User',
        email: 'teacher@example.com',
        password: await bcrypt.hash('user', 10),
        type: 'TEACHER',
      },
      {
        name: 'Student User',
        email: 'student@example.com',
        password: await bcrypt.hash('user', 10),
        type: 'STUDENT',
      },
    ];

    await this.userRepository.save(users);
  }

  async drop(): Promise<any> {
    await this.userRepository.clear();
  }
}
