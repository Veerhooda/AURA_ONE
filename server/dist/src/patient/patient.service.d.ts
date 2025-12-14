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
            weight: string;
            symptoms: string;
        };
        status: string;
        diagnosis: string;
        current_state: {
            heart_rate: any;
            blood_pressure: any;
            spo2: any;
            risk_score: number;
            pain_level: number;
            pain_reported_at: Date;
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
        createdAt: Date;
        userId: number;
        mrn: string;
        dob: Date;
        gender: string;
        bed: string | null;
        ward: string | null;
        riskScore: number | null;
        diagnosis: string | null;
        weight: string | null;
        status: string | null;
        symptoms: string | null;
        painLevel: number | null;
        painReportedAt: Date | null;
        latestVitals: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        user: {
            id: number;
            email: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            blockchainId: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        mrn: string;
        dob: Date;
        gender: string;
        bed: string | null;
        ward: string | null;
        riskScore: number | null;
        diagnosis: string | null;
        weight: string | null;
        status: string | null;
        symptoms: string | null;
        painLevel: number | null;
        painReportedAt: Date | null;
        latestVitals: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    })[]>;
    reportPain(patientId: number, level: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        mrn: string;
        dob: Date;
        gender: string;
        bed: string | null;
        ward: string | null;
        riskScore: number | null;
        diagnosis: string | null;
        weight: string | null;
        status: string | null;
        symptoms: string | null;
        painLevel: number | null;
        painReportedAt: Date | null;
        latestVitals: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    updateProfileByUserId(userId: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        mrn: string;
        dob: Date;
        gender: string;
        bed: string | null;
        ward: string | null;
        riskScore: number | null;
        diagnosis: string | null;
        weight: string | null;
        status: string | null;
        symptoms: string | null;
        painLevel: number | null;
        painReportedAt: Date | null;
        latestVitals: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        mrn: string;
        dob: Date;
        gender: string;
        bed: string | null;
        ward: string | null;
        riskScore: number | null;
        diagnosis: string | null;
        weight: string | null;
        status: string | null;
        symptoms: string | null;
        painLevel: number | null;
        painReportedAt: Date | null;
        latestVitals: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    addMedication(patientId: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        patientId: number;
        dosage: string;
        frequency: string;
        startDate: Date;
        endDate: Date | null;
        active: boolean;
        medicationId: number;
    }>;
    addHistory(id: number, note: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        mrn: string;
        dob: Date;
        gender: string;
        bed: string | null;
        ward: string | null;
        riskScore: number | null;
        diagnosis: string | null;
        weight: string | null;
        status: string | null;
        symptoms: string | null;
        painLevel: number | null;
        painReportedAt: Date | null;
        latestVitals: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    getPatientMedications(patientId: number): Promise<{
        id: number;
        name: string;
        dosage: string;
        frequency: string;
        startDate: Date;
        active: boolean;
    }[]>;
    getPatientHistory(patientId: number): Promise<{
        date: string;
        type: string;
        note: string;
    }[]>;
    getPatientReports(patientId: number): Promise<{
        id: number;
        name: string;
        type: string;
        date: string;
        size: string;
        url: string;
    }[]>;
    uploadReport(patientId: number, fileName: string, fileType: string): Promise<{
        message: string;
        fileId: number;
    }>;
    addManualVital(patientId: number, type: string, value: number, unit: string): Promise<{
        id: number;
        timestamp: Date;
        patientId: number;
        type: string;
        value: number;
        unit: string;
    }>;
}
