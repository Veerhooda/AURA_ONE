import { PrismaService } from '../prisma/prisma.service';
export declare class EmergencyFallbackService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    sendPushNotification(alertId: number, deviceToken: string, payload: any): Promise<boolean>;
    sendSMS(alertId: number, phoneNumber: string, message: string): Promise<boolean>;
    attemptDeliveryWithFallback(alertId: number, userId: number, payload: any): Promise<void>;
    private logDeliveryAttempt;
    private getDeviceToken;
    retryUndeliveredAlerts(): Promise<void>;
}
