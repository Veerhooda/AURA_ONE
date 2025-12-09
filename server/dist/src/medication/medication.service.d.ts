import { PrismaService } from '../prisma/prisma.service';
export declare class MedicationService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllMedications(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }[]>;
    createMedication(data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }>;
    getPatientPrescriptions(patientId: number): Promise<({
        medication: {
            id: number;
            name: string;
            createdAt: Date;
            description: string | null;
            sideEffects: string | null;
            interactions: string | null;
        };
    } & {
        id: number;
        patientId: number;
        createdAt: Date;
        medicationId: number;
        dosage: string;
        frequency: string;
        startDate: Date;
        endDate: Date | null;
        active: boolean;
    })[]>;
    prescribe(patientId: number, medicationId: number, dosage: string, frequency: string): Promise<{
        prescription: {
            id: number;
            patientId: number;
            createdAt: Date;
            medicationId: number;
            dosage: string;
            frequency: string;
            startDate: Date;
            endDate: Date | null;
            active: boolean;
        };
        warnings: string[];
    }>;
}
