"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
let ChatService = class ChatService {
    constructor() {
        this.messages = [];
        this.messageIdCounter = 1;
    }
    addMessage(senderId, recipientId, message) {
        const newMessage = {
            id: this.messageIdCounter++,
            senderId,
            recipientId,
            message,
            timestamp: new Date(),
        };
        this.messages.push(newMessage);
        return newMessage;
    }
    getHistory(userId, otherUserId) {
        return this.messages.filter((msg) => (msg.senderId === userId && msg.recipientId === otherUserId) ||
            (msg.senderId === otherUserId && msg.recipientId === userId)).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map