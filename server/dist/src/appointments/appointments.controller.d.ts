import { AppointmentsService } from './appointments.service';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    createAppointment(body: {
        patientId: number;
        doctorId: number;
        dateTime: string;
        type: string;
        notes?: string;
    }): Promise<{
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
    getAvailableSlots(doctorId: number, date: string): Promise<any[]>;
    updateAppointment(id: number, body: {
        status: string;
    }): Promise<{
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
}
