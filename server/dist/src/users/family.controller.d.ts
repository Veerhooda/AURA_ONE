import { PrismaService } from '../prisma/prisma.service';
export declare class CreateFamilyPatientDto {
    name: string;
    email: string;
    password: string;
    mrn: string;
    dob: string;
    gender: string;
    weight?: string;
    relationship: string;
}
export declare class AddExistingPatientDto {
    patientId: number;
    relationship: string;
}
export declare class FamilyController {
    private prisma;
    constructor(prisma: PrismaService);
    getMyPatients(req: any): Promise<{
        relation: string;
        patientId: number;
        name: string;
        email: string;
        ward: string;
        lastVitals: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        activeAlerts: number;
        status: string;
        lastSeen: Date;
    }[]>;
    createFamilyPatient(req: any, body: CreateFamilyPatientDto): Promise<{
        success: boolean;
        patientId: number;
        userId: number;
        message: string;
    }>;
    addExistingPatient(req: any, body: AddExistingPatientDto): Promise<{
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
        relationship: string;
    }[]>;
}
