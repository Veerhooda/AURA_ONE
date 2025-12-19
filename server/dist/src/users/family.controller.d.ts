import { PrismaService } from '../prisma/prisma.service';
export declare class FamilyController {
    private prisma;
    constructor(prisma: PrismaService);
    getMyPatients(req: any): Promise<{
        relation: string;
        patientId: number;
        name: string;
        email: string;
        ward: string;
        lastVitals: {
            id: number;
            patientId: number;
            timestamp: Date;
            type: string;
            value: number;
            unit: string;
        };
        activeAlerts: number;
        status: string;
        lastSeen: Date;
    }[]>;
    createFamilyPatient(req: any, body: {
        name: string;
        email: string;
        password: string;
        mrn: string;
        dob: string;
        gender: string;
        weight?: string;
        relationship: string;
    }): Promise<{
        success: boolean;
        patientId: number;
        userId: number;
        message: string;
    }>;
    addExistingPatient(req: any, body: {
        patientId: number;
        relationship: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    removePatient(req: any, patientId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private _determineStatus;
    getMyGuardians(patientId: string): Promise<{
        id: number;
        name: string;
        email: string;
        relationship: string;
    }[]>;
}
