import { EmergencyService } from './emergency.service';
import { AuditService } from '../audit/audit.service';
export declare class EmergencyController {
    private emergencyService;
    private auditService;
    constructor(emergencyService: EmergencyService, auditService: AuditService);
    acknowledgeEmergency(body: {
        alertId: number;
        userId: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getUnacknowledgedAlerts(patientId: string): Promise<any[]>;
    getAllUnacknowledgedAlerts(): Promise<any[]>;
}
