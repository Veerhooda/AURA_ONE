export interface Message {
    id: number;
    senderId: number;
    recipientId: number;
    message: string;
    timestamp: Date;
}
export declare class ChatService {
    private messages;
    private messageIdCounter;
    addMessage(senderId: number, recipientId: number, message: string): Message;
    getHistory(userId: number, otherUserId: number): Message[];
}
