import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChatHistory(userId: number, otherUserId: number): import("./chat.service").Message[];
}
