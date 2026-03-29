import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateConversation(patientId: number, doctorId: number): Promise<{
        patient: {
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
        patientId: number;
        doctorId: number;
        lastMessageAt: Date;
    }>;
    sendMessage(senderId: number, conversationId: number, content: string, type?: string, attachmentUrl?: string, linkedVitalsId?: number): Promise<{
        id: number;
        createdAt: Date;
        linkedVitalsId: number | null;
        type: string;
        senderId: number;
        senderType: string;
        content: string;
        sequence: number;
        idempotencyKey: string | null;
        conversationId: number;
    }>;
    getMessages(conversationId: number): Promise<{
        id: number;
        createdAt: Date;
        linkedVitalsId: number | null;
        type: string;
        senderId: number;
        senderType: string;
        content: string;
        sequence: number;
        idempotencyKey: string | null;
        conversationId: number;
    }[]>;
    getConversationMessages(conversationId: number, limit?: number): Promise<{
        id: number;
        createdAt: Date;
        linkedVitalsId: number | null;
        type: string;
        senderId: number;
        senderType: string;
        content: string;
        sequence: number;
        idempotencyKey: string | null;
        conversationId: number;
    }[]>;
    getDoctorInbox(doctorId: number): Promise<({
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
        _count: {
            messages: number;
        };
        messages: {
            id: number;
            createdAt: Date;
            type: string;
            senderType: string;
            content: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        patientId: number;
        doctorId: number;
        lastMessageAt: Date;
    })[]>;
    getPatientConversations(patientId: number): Promise<({
        patient: {
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
        patientId: number;
        doctorId: number;
        lastMessageAt: Date;
    })[]>;
    private _previewContent;
}
