import { PatientService } from './patient.service';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    getDigitalTwin(id: number): Promise<{
        metadata: {
            name: string;
            mrn: string;
            bed: string;
            ward: string;
        };
        current_state: {
            heart_rate: {
                value: any;
                unit: any;
                time: any;
            };
            blood_pressure: {
                value: any;
                unit: any;
                time: any;
            };
            spo2: {
                value: any;
                unit: any;
                time: any;
            };
            risk_score: number;
        };
        risk_predictions: {
            hypotension_6h: number;
            cardiac_event_24h: number;
            deterioration_prob: number;
        };
        trend_summary: string[];
    }>;
    findAll(): Promise<({
        user: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: number;
        userId: number;
        mrn: string;
        dob: Date;
        gender: string;
        bed: string | null;
        ward: string | null;
        riskScore: number | null;
        diagnosis: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(createPatientDto: any): Promise<{
        id: number;
        userId: number;
        mrn: string;
        dob: Date;
        gender: string;
        bed: string | null;
        ward: string | null;
        riskScore: number | null;
        diagnosis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
