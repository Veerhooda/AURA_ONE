import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
export declare class PatientService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    generateRecoveryGraph(id: number): Promise<{
        summary: any;
        recovery_graph_url: any;
    }>;
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
        updatedAt: Date;
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
        version: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(): Promise<({
        user: {
            id: number;
            email: string;
            blockchainId: string | null;
            password: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
        version: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    reportPain(patientId: number, level: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
        version: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateProfileByUserId(userId: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
        version: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
        version: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    addMedication(patientId: number, data: any): Promise<void>;
    addHistory(id: number, note: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
        version: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getPatientMedications(patientId: number): Promise<any[]>;
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
        success: boolean;
    }>;
}
