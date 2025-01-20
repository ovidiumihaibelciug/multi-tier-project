import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const { participantIds } = createChatDto;

    if (participantIds.length !== 2) {
      throw new BadRequestException(
        'A chat must have exactly two participants.',
      );
    }

    const participants = await this.userRepository.findByIds(participantIds);

    if (participants.length !== 2) {
      throw new BadRequestException('Some users do not exist.');
    }

    const chat = this.chatRepository.create({ participants });
    return this.chatRepository.save(chat);
  }

  async findAll(): Promise<Chat[]> {
    return this.chatRepository.find({
      relations: ['participants', 'messages'],
    });
  }

  async findAllForUser(userId: string): Promise<Chat[]> {
    return this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('chat.messages', 'message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('c.id')
          .from('chat', 'c')
          .innerJoin('c.participants', 'p')
          .where('p.id = :userId')
          .getQuery();
        return 'chat.id IN ' + subQuery;
      })
      .setParameter('userId', userId)
      .getMany();
  }

  async findOne(id: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['participants', 'messages', 'messages.sender'],
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    return chat;
  }

  async sendMessage(
    chatId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<Message> {
    const { senderId, content } = sendMessageDto;

    const chat = await this.findOne(chatId);
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    if (!sender) {
      throw new NotFoundException(`Sender with ID ${senderId} not found`);
    }

    const message = this.messageRepository.create({ chat, sender, content });
    return this.messageRepository.save(message);
  }

  async findMessages(chatId: string): Promise<Message[]> {
    const chat = await this.findOne(chatId);

    return this.messageRepository.find({
      where: { chat },
      relations: ['sender'],
    });
  }

  async remove(id: string): Promise<void> {
    const chat = await this.findOne(id);
    await this.chatRepository.remove(chat);
  }
}
