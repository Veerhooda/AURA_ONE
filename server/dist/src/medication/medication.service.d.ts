import { PrismaService } from '../prisma/prisma.service';
export declare class MedicationService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllMedications(): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }[]>;
    createMedication(data: any): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }>;
    getPatientPrescriptions(patientId: number): Promise<({
        medication: {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            sideEffects: string | null;
            interactions: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        patientId: number;
        dosage: string;
        frequency: string;
        startDate: Date;
        endDate: Date | null;
        active: boolean;
        medicationId: number;
    })[]>;
    prescribe(patientId: number, medicationId: number, dosage: string, frequency: string): Promise<{
        prescription: {
            id: number;
            createdAt: Date;
            patientId: number;
            dosage: string;
            frequency: string;
            startDate: Date;
            endDate: Date | null;
            active: boolean;
            medicationId: number;
        };
        warnings: string[];
    }>;
}
