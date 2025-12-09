import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
export declare class EventsGateway implements OnModuleInit {
    server: Server;
    private activeSessions;
    onModuleInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribePatient(data: {
        patientId: number;
    }, client: Socket): {
        event: string;
        data: number;
    };
    handleUnsubscribePatient(client: Socket): {
        event: string;
    };
    private startStreaming;
    private stopStreaming;
    private simulateECG;
}
