"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateConversation(patientId, doctorId) {
        let conversation = await this.prisma.conversation.findUnique({
            where: {
                patientId_doctorId: {
                    patientId,
                    doctorId,
                },
            },
            include: {
                patient: { include: { user: true } },
                doctor: true,
            }
        });
        if (!conversation) {
            conversation = await this.prisma.conversation.create({
                data: {
                    patientId,
                    doctorId,
                },
                include: {
                    patient: { include: { user: true } },
                    doctor: true,
                }
            });
        }
        return conversation;
    }
    async sendMessage(senderId, conversationId, content, type = 'TEXT', attachmentUrl, linkedVitalsId) {
        const user = await this.prisma.user.findUnique({
            where: { id: senderId },
            select: { role: true }
        });
        if (!user) {
            throw new Error(`User with id ${senderId} not found`);
        }
        const senderType = user.role;
        const message = await this.prisma.message.create({
            data: {
                senderId,
                senderType,
                conversationId,
                content,
                type,
                linkedVitalsId,
                sequence: 0,
            }
        });
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessageAt: new Date(),
            }
        });
        return message;
    }
    async getMessages(conversationId) {
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getConversationMessages(conversationId, limit = 50) {
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getDoctorInbox(doctorId) {
        return this.prisma.conversation.findMany({
            where: { doctorId },
            orderBy: { lastMessageAt: 'desc' },
            include: {
                patient: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                },
                doctor: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        id: true,
                        content: true,
                        type: true,
                        createdAt: true,
                        senderType: true
                    }
                },
                _count: {
                    select: { messages: true }
                }
            }
        });
    }
    async getPatientConversations(patientId) {
        return this.prisma.conversation.findMany({
            where: { patientId },
            include: {
                doctor: true,
                patient: { include: { user: true } },
            },
            orderBy: { lastMessageAt: 'desc' }
        });
    }
    _previewContent(content, type) {
        if (type === 'TEXT') {
            return content.substring(0, 50);
        }
        return `[${type}]`;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map