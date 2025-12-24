import { PrismaService } from '../prisma/prisma.service';
export declare class ConsentService {
    private prisma;
    constructor(prisma: PrismaService);
    hasConsent(guardianId: number, patientId: number, consentType: string): Promise<boolean>;
    grantConsent(patientId: number, guardianId: number, consentType: string, grantedBy: number): Promise<{
        id: number;
        patientId: number;
        consentType: string;
        grantedAt: Date;
        revokedAt: Date | null;
        grantedBy: number;
        guardianId: number;
    }>;
    revokeConsent(patientId: number, guardianId: number, consentType: string): Promise<{
        id: number;
        patientId: number;
        consentType: string;
        grantedAt: Date;
        revokedAt: Date | null;
        grantedBy: number;
        guardianId: number;
    }>;
    getPatientConsents(patientId: number): Promise<({
        guardian: {
            id: number;
            email: string;
            name: string;
        };
    } & {
        id: number;
        patientId: number;
        consentType: string;
        grantedAt: Date;
        revokedAt: Date | null;
        grantedBy: number;
        guardianId: number;
    })[]>;
    getGuardianConsents(guardianId: number): Promise<({
        patient: {
            id: number;
            user: {
                name: string;
            };
            mrn: string;
        };
    } & {
        id: number;
        patientId: number;
        consentType: string;
        grantedAt: Date;
        revokedAt: Date | null;
        grantedBy: number;
        guardianId: number;
    })[]>;
}
