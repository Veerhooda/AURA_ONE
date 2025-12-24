import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { VitalsValidationService } from '../vitals/vitals-validation.service';
import { EmergencyAlertDto } from './dto/emergency-alert.dto';
import { EmergencyService } from '../emergency/emergency.service';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    private jwtService;
    private vitalsValidation;
    private emergencyService;
    server: Server;
    private lastUpdate;
    constructor(prisma: PrismaService, jwtService: JwtService, vitalsValidation: VitalsValidationService, emergencyService: EmergencyService);
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleSubscribePatient(client: Socket, data: {
        patientId: number;
    }): Promise<{
        event: string;
        data: {
            room: string;
        };
    }>;
    handleUnsubscribePatient(client: Socket, data: {
        patientId: number;
    }): {
        event: string;
        data: {
            room: string;
        };
    };
    handleSimulateVitals(client: Socket, data: any): Promise<void>;
    handlePatientEmergency(client: Socket, data: EmergencyAlertDto): Promise<void>;
    handleSubscribeUser(client: Socket, data: {
        userId: number;
    }): {
        event: string;
        data: {
            room: string;
        };
    };
    broadcastVitals(patientId: number, data: any): void;
}
