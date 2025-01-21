import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Get()
  async findAll(@Headers('X-User-ID') userId: string) {
    return this.chatsService.findAllForUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatsService.sendMessage(id, sendMessageDto);
  }

  @Get(':id/messages')
  async findMessages(@Param('id') id: string) {
    return this.chatsService.findMessages(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }
}
