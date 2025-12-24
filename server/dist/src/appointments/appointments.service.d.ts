import { PrismaService } from '../prisma/prisma.service';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createAppointment(patientId: number, doctorId: number, dateTime: Date, type: string, notes?: string): Promise<{
        patient: {
            user: {
                email: string;
                name: string;
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
        };
        doctor: {
            id: number;
            email: string;
            name: string;
            createdAt: Date;
            userId: number | null;
            specialty: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: number;
        doctorId: number;
        notes: string | null;
        type: string;
        dateTime: Date;
    }>;
    getPatientAppointments(patientId: number): Promise<({
        doctor: {
            id: number;
            email: string;
            name: string;
            createdAt: Date;
            userId: number | null;
            specialty: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: number;
        doctorId: number;
        notes: string | null;
        type: string;
        dateTime: Date;
    })[]>;
    getAllDoctors(): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        userId: number | null;
        specialty: string;
    }[]>;
    updateAppointmentStatus(id: number, status: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: number;
        doctorId: number;
        notes: string | null;
        type: string;
        dateTime: Date;
    }>;
    cancelAppointment(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: number;
        doctorId: number;
        notes: string | null;
        type: string;
        dateTime: Date;
    }>;
    getAvailableSlots(doctorId: number, date: Date): any[];
}
