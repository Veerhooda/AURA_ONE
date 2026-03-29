import { ChatService } from './chat.service';
declare class StartChatDto {
    patientId: number;
    doctorId: number;
}
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getConversation(body: StartChatDto): Promise<{
        messages: {
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
        }[];
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
        id: number;
        createdAt: Date;
        patientId: number;
        doctorId: number;
        lastMessageAt: Date;
    }>;
    getDoctorInbox(req: any): Promise<({
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
    getPatientInbox(patientId: string): Promise<({
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
    getHistory(conversationId: string): Promise<{
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
    getConversationMessages(id: string): Promise<{
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
}
export {};
