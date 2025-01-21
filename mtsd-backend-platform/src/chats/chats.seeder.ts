import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { Message } from './entities/message.entity';

export class ChatSeeder implements Seeder {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async seed(): Promise<any> {
    const existingChats = await this.chatRepository.count();
    if (existingChats > 0) return;

    const users = await this.userRepository.find();
    if (users.length < 3) {
      throw new Error('Not enough users to create chats. Seed users first.');
    }

    const chats = [
      {
        participants: [users[0], users[1]],
      },
      {
        participants: [users[1], users[2]],
      },
      {
        participants: [users[0], users[2]],
      },
    ];

    for (const chatData of chats) {
      const chat = this.chatRepository.create(chatData);
      const savedChat = await this.chatRepository.save(chat);

      const messages = [
        {
          content: 'Hello! How are you?',
          sender: chatData.participants[0],
          chat: savedChat,
        },
        {
          content: 'I am good! How about you?',
          sender: chatData.participants[1],
          chat: savedChat,
        },
        {
          content: 'Doing great, thanks!',
          sender: chatData.participants[0],
          chat: savedChat,
        },
      ];

      for (const messageData of messages) {
        const message = this.messageRepository.create(messageData);
        await this.messageRepository.save(message);
      }
    }
  }

  async drop(): Promise<any> {
    await this.messageRepository.clear();
    await this.chatRepository.clear();
  }
}
