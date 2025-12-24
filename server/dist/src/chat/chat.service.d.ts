import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateConversation(patientId: number, doctorId: number): Promise<{
        patient: {
            user: {
                id: number;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                email: string;
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
            version: number;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            updatedAt: Date;
        };
        doctor: {
            id: number;
            createdAt: Date;
            name: string;
            userId: number | null;
            email: string;
            specialty: string;
        };
    } & {
        id: number;
        patientId: number;
        doctorId: number;
        lastMessageAt: Date;
        createdAt: Date;
    }>;
    sendMessage(senderId: number, conversationId: number, content: string, type?: string, attachmentUrl?: string, linkedVitalsId?: number): Promise<{
        id: number;
        createdAt: Date;
        senderId: number;
        senderType: string;
        content: string;
        type: string;
        linkedVitalsId: number | null;
        sequence: number;
        idempotencyKey: string | null;
        conversationId: number;
    }>;
    getMessages(conversationId: number): Promise<{
        id: number;
        createdAt: Date;
        senderId: number;
        senderType: string;
        content: string;
        type: string;
        linkedVitalsId: number | null;
        sequence: number;
        idempotencyKey: string | null;
        conversationId: number;
    }[]>;
    getConversationMessages(conversationId: number, limit?: number): Promise<{
        id: number;
        createdAt: Date;
        senderId: number;
        senderType: string;
        content: string;
        type: string;
        linkedVitalsId: number | null;
        sequence: number;
        idempotencyKey: string | null;
        conversationId: number;
    }[]>;
    getDoctorInbox(doctorId: number): Promise<({
        patient: {
            user: {
                name: string;
                email: string;
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
            version: number;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            updatedAt: Date;
        };
        doctor: {
            id: number;
            createdAt: Date;
            name: string;
            userId: number | null;
            email: string;
            specialty: string;
        };
        messages: {
            id: number;
            createdAt: Date;
            senderType: string;
            content: string;
            type: string;
        }[];
        _count: {
            messages: number;
        };
    } & {
        id: number;
        patientId: number;
        doctorId: number;
        lastMessageAt: Date;
        createdAt: Date;
    })[]>;
    getPatientConversations(patientId: number): Promise<({
        patient: {
            user: {
                id: number;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                email: string;
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
            version: number;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            updatedAt: Date;
        };
        doctor: {
            id: number;
            createdAt: Date;
            name: string;
            userId: number | null;
            email: string;
            specialty: string;
        };
    } & {
        id: number;
        patientId: number;
        doctorId: number;
        lastMessageAt: Date;
        createdAt: Date;
    })[]>;
    private _previewContent;
}
