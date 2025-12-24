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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(chatService, jwtService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
    }
    handleConnection(client) {
        var _a;
        try {
            const token = client.handshake.auth.token || ((_a = client.handshake.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
            if (!token) {
                console.warn(`❌ Chat: Client ${client.id} missing token`);
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            client.data.user = {
                userId: payload.sub,
                email: payload.email,
                role: payload.role,
            };
            console.log(`💬 Chat: Client ${client.id} connected as ${payload.role} (${payload.email})`);
        }
        catch (error) {
            console.error(`❌ Chat: Invalid token for client ${client.id}:`, error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`💬 Chat: Client disconnected: ${client.id}`);
    }
    async handleJoinConversation(client, data) {
        const room = `conversation_${data.conversationId}`;
        client.join(room);
        const user = client.data.user;
        console.log(`💬 Client ${client.id} (${user === null || user === void 0 ? void 0 : user.email}) joined conversation room ${room}`);
        return { status: 'joined', room };
    }
    async handleSendMessage(client, data) {
        console.log(`💬 Received message from senderId=${data.senderId} in conversation ${data.conversationId}`);
        try {
            const message = await this.chatService.sendMessage(data.senderId, data.conversationId, data.content, data.type || 'TEXT', data.attachmentUrl, data.linkedVitalsId);
            console.log(`💾 Message saved with id=${message.id}, broadcasting to conversation_${data.conversationId}`);
            this.server.to(`conversation_${data.conversationId}`).emit('newMessage', message);
            console.log(`✅ Message broadcast complete`);
            return message;
        }
        catch (error) {
            console.error(`❌ Error sending message:`, error);
            throw error;
        }
    }
    async handleTyping(client, data) {
        client.to(`conversation_${data.conversationId}`).emit('typing', data);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map