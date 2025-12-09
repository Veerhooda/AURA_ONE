import { MedicationService } from './medication.service';
export declare class MedicationController {
    private readonly medicationService;
    constructor(medicationService: MedicationService);
    getAll(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }[]>;
    getPrescriptions(id: number): Promise<({
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
    prescribe(patientId: number, body: {
        medicationId: number;
        dosage: string;
        frequency: string;
    }): Promise<{
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
