import { MedicationService } from './medication.service';
export declare class MedicationController {
    private readonly medicationService;
    constructor(medicationService: MedicationService);
    getAll(): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }[]>;
    getPrescriptions(id: number): Promise<({
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
    prescribe(patientId: number, body: {
        medicationId: number;
        dosage: string;
        frequency: string;
    }): Promise<{
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
