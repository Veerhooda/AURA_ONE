import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from '../chat/chat.service';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    private chatService;
    server: Server;
    private lastUpdate;
    constructor(prisma: PrismaService, chatService: ChatService);
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleSubscribePatient(client: Socket, data: {
        patientId: number;
    }): {
        event: string;
        data: {
            room: string;
        };
    };
    handleUnsubscribePatient(client: Socket, data: {
        patientId: number;
    }): {
        event: string;
        data: {
            room: string;
        };
    };
    handleSimulateVitals(client: Socket, data: any): Promise<void>;
    handlePatientEmergency(client: Socket, data: any): void;
    handleSendMessage(client: Socket, data: {
        senderId: number;
        recipientId: number;
        message: string;
    }): {
        success: boolean;
        message: import("../chat/chat.service").Message;
    };
    handleSubscribeUser(client: Socket, data: {
        userId: number;
    }): {
        event: string;
        data: {
            room: string;
        };
    };
}
