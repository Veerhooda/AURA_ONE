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
            conversationId: number;
            senderId: number;
            senderType: string;
            content: string;
            type: string;
            linkedVitalsId: number | null;
            sequence: number;
            idempotencyKey: string | null;
        }[];
        patient: {
            user: {
                email: string;
                role: import(".prisma/client").$Enums.Role;
                name: string;
                id: number;
                password: string;
                blockchainId: string | null;
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
            email: string;
            name: string;
            id: number;
            createdAt: Date;
            userId: number | null;
            specialty: string;
        };
        doctorId: number;
        id: number;
        createdAt: Date;
        patientId: number;
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
        _count: {
            messages: number;
        };
        doctor: {
            email: string;
            name: string;
            id: number;
            createdAt: Date;
            userId: number | null;
            specialty: string;
        };
        messages: {
            id: number;
            createdAt: Date;
            senderType: string;
            content: string;
            type: string;
        }[];
    } & {
        doctorId: number;
        id: number;
        createdAt: Date;
        patientId: number;
        lastMessageAt: Date;
    })[]>;
    getPatientInbox(patientId: string): Promise<({
        patient: {
            user: {
                email: string;
                role: import(".prisma/client").$Enums.Role;
                name: string;
                id: number;
                password: string;
                blockchainId: string | null;
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
            email: string;
            name: string;
            id: number;
            createdAt: Date;
            userId: number | null;
            specialty: string;
        };
    } & {
        doctorId: number;
        id: number;
        createdAt: Date;
        patientId: number;
        lastMessageAt: Date;
    })[]>;
    getHistory(conversationId: string): Promise<{
        id: number;
        createdAt: Date;
        conversationId: number;
        senderId: number;
        senderType: string;
        content: string;
        type: string;
        linkedVitalsId: number | null;
        sequence: number;
        idempotencyKey: string | null;
    }[]>;
    getConversationMessages(id: string): Promise<{
        id: number;
        createdAt: Date;
        conversationId: number;
        senderId: number;
        senderType: string;
        content: string;
        type: string;
        linkedVitalsId: number | null;
        sequence: number;
        idempotencyKey: string | null;
    }[]>;
}
export {};
