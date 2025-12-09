import { PrismaService } from '../prisma/prisma.service';
export declare class PatientService {
    private prisma;
    constructor(prisma: PrismaService);
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
    private getLatestVital;
    createPatient(data: any): Promise<{
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
}
