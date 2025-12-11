import { MedicationService } from './medication.service';
export declare class MedicationController {
    private readonly medicationService;
    constructor(medicationService: MedicationService);
    getAll(): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        description: string | null;
        sideEffects: string | null;
        interactions: string | null;
    }[]>;
    getPrescriptions(id: number): Promise<({
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
    prescribe(patientId: number, body: {
        medicationId: number;
        dosage: string;
        frequency: string;
    }): Promise<{
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
