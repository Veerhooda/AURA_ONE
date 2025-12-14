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
        };
        doctor: {
            id: number;
            createdAt: Date;
            email: string;
            name: string;
            specialty: string;
        };
    } & {
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        type: string;
        dateTime: Date;
        notes: string | null;
        doctorId: number;
    }>;
    getPatientAppointments(patientId: number): Promise<({
        doctor: {
            id: number;
            createdAt: Date;
            email: string;
            name: string;
            specialty: string;
        };
    } & {
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        type: string;
        dateTime: Date;
        notes: string | null;
        doctorId: number;
    })[]>;
    getAllDoctors(): Promise<{
        id: number;
        createdAt: Date;
        email: string;
        name: string;
        specialty: string;
    }[]>;
    updateAppointmentStatus(id: number, status: string): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        type: string;
        dateTime: Date;
        notes: string | null;
        doctorId: number;
    }>;
    cancelAppointment(id: number): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: number;
        type: string;
        dateTime: Date;
        notes: string | null;
        doctorId: number;
    }>;
    getAvailableSlots(doctorId: number, date: Date): any[];
}
