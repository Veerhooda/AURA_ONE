import { PrismaService } from '../prisma/prisma.service';
export declare class EmergencyQueueService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getActiveQueue(userId: number): Promise<any[]>;
    getNextEmergency(): Promise<any | null>;
    getQueueCount(): Promise<number>;
    acknowledgeAndNext(alertId: number, userId: number): Promise<any | null>;
}
