export declare class CorruptionAlertService {
    private readonly logger;
    alertCorruption(correlationId: string, entityType: string, entityId: number, encryptedData: string, error: string): Promise<void>;
    private sendSlackAlert;
    private sendEmailAlert;
    alertVitalsFailure(patientId: number, vitalsData: any, error: string): Promise<void>;
    alertEmergencyDeliveryFailure(alertId: number, patientId: number, attempts: string[]): Promise<void>;
}
