import { PrismaService } from '../prisma/prisma.service';
export declare class EmergencyService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createEmergencyAlert(patientId: number, severity: string, vitalType: string, value?: string, notes?: string): Promise<number>;
    markDelivered(alertId: number, channel: 'WEBSOCKET' | 'PUSH' | 'SMS'): Promise<void>;
    acknowledgeEmergency(alertId: number, userId: number): Promise<boolean>;
    getUndeliveredAlerts(): Promise<any[]>;
    getUnacknowledgedAlerts(patientId?: number): Promise<any[]>;
    incrementRetry(alertId: number): Promise<void>;
    resolveEmergency(alertId: number): Promise<void>;
}
