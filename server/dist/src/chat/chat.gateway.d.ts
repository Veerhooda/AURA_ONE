import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private jwtService;
    server: Server;
    constructor(chatService: ChatService, jwtService: JwtService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinConversation(client: Socket, data: {
        conversationId: number;
    }): Promise<{
        status: string;
        room: string;
    }>;
    handleSendMessage(client: Socket, data: {
        conversationId: number;
        senderId: number;
        content: string;
        type?: string;
        attachmentUrl?: string;
        linkedVitalsId?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        senderId: number;
        senderType: string;
        content: string;
        type: string;
        linkedVitalsId: number | null;
        sequence: number;
        idempotencyKey: string | null;
        conversationId: number;
    }>;
    handleTyping(client: Socket, data: {
        conversationId: number;
        isTyping: boolean;
        userName: string;
    }): Promise<void>;
}
