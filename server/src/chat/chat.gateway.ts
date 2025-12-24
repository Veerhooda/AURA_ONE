import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.warn(`❌ Chat: Client ${client.id} missing token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      
      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      
      console.log(`💬 Chat: Client ${client.id} connected as ${payload.role} (${payload.email})`);
    } catch (error) {
      console.error(`❌ Chat: Invalid token for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`💬 Chat: Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number },
  ) {
    const room = `conversation_${data.conversationId}`;
    client.join(room);
    const user = client.data.user;
    console.log(`💬 Client ${client.id} (${user?.email}) joined conversation room ${room}`);
    return { status: 'joined', room };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      conversationId: number;
      senderId: number;
      content: string;
      type?: string;
      attachmentUrl?: string;
      linkedVitalsId?: number;
    },
  ) {
    console.log(`💬 Received message from senderId=${data.senderId} in conversation ${data.conversationId}`);
    
    try {
      // 1. Persist to DB
      const message = await this.chatService.sendMessage(
        data.senderId,
        data.conversationId,
        data.content,
        data.type || 'TEXT',
        data.attachmentUrl,
        data.linkedVitalsId,
      );

      console.log(`💾 Message saved with id=${message.id}, broadcasting to conversation_${data.conversationId}`);
      
      // 2. Broadcast to Room
      this.server.to(`conversation_${data.conversationId}`).emit('newMessage', message);
      console.log(`✅ Message broadcast complete`);

      return message;
    } catch (error) {
      console.error(`❌ Error sending message:`, error);
      throw error;
    }
  }
  
  @SubscribeMessage('typing')
  async handleTyping(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { conversationId: number; isTyping: boolean; userName: string }
  ) {
      client.to(`conversation_${data.conversationId}`).emit('typing', data);
  }
}
