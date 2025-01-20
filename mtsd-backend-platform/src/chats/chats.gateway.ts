import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { Message } from './entities/message.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { chatId: string; senderId: string; content: string },
  ) {
    const { chatId, senderId, content } = payload;

    const message: Message = await this.chatsService.sendMessage(chatId, {
      senderId,
      content,
    });

    this.server.to(`chat_${chatId}`).emit('receiveMessage', message);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, chatId: number) {
    client.join(`chat_${chatId}`);
    console.log(`Client ${client.id} joined chat_${chatId}`);
  }

  // Leave a chat room
  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, chatId: number) {
    client.leave(`chat_${chatId}`);
    console.log(`Client ${client.id} left chat_${chatId}`);
  }
}
