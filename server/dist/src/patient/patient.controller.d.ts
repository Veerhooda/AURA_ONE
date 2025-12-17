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
    getRecoveryGraph(id: number): Promise<{
        summary: any;
        recovery_graph_url: any;
    }>;
    findAll(): Promise<({
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            password: string;
            blockchainId: string | null;
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
        weight: string | null;
        status: string | null;
        symptoms: string | null;
        painLevel: number | null;
        painReportedAt: Date | null;
        latestVitals: import("@prisma/client/runtime/library").JsonValue | null;
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
        weight: string | null;
        status: string | null;
        symptoms: string | null;
        painLevel: number | null;
        painReportedAt: Date | null;
        latestVitals: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reportPain(id: number, level: number): Promise<{
        id: number;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, data: any): Promise<{
        id: number;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: number, body: {
        status: string;
    }): Promise<{
        id: number;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMedication(id: number, data: any): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPatientMedications(id: number): Promise<{
        id: number;
        name: string;
        dosage: string;
        frequency: string;
        startDate: Date;
        active: boolean;
    }[]>;
    getPatientHistory(id: number): Promise<{
        date: string;
        type: string;
        note: string;
    }[]>;
    getPatientReports(id: number): Promise<{
        id: number;
        name: string;
        type: string;
        date: string;
        size: string;
        url: string;
    }[]>;
    uploadReport(id: number, body: {
        fileName: string;
        fileType: string;
    }): Promise<{
        message: string;
        fileId: number;
    }>;
    addManualVital(id: number, body: {
        type: string;
        value: number;
        unit: string;
    }): Promise<{
        id: number;
        timestamp: Date;
        patientId: number;
        type: string;
        value: number;
        unit: string;
    }>;
}
