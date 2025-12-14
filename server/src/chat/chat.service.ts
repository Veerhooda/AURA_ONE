import { Injectable } from '@nestjs/common';

export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  message: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  private messages: Message[] = [];
  private messageIdCounter = 1;

  addMessage(senderId: number, recipientId: number, message: string): Message {
    const newMessage: Message = {
      id: this.messageIdCounter++,
      senderId,
      recipientId,
      message,
      timestamp: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  getHistory(userId: number, otherUserId: number): Message[] {
    return this.messages.filter(
      (msg) =>
        (msg.senderId === userId && msg.recipientId === otherUserId) ||
        (msg.senderId === otherUserId && msg.recipientId === userId),
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}
