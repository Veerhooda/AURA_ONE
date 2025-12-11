import { PrismaService } from '../prisma/prisma.service';
export declare class MedicationService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllMedications(): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }[]>;
    createMedication(data: any): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }>;
    getPatientPrescriptions(patientId: number): Promise<({
        medication: {
            name: string;
            id: number;
            createdAt: Date;
            description: string | null;
            sideEffects: string | null;
            interactions: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        patientId: number;
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
            createdAt: Date;
            patientId: number;
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
