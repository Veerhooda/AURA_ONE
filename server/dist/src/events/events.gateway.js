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
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
const chat_service_1 = require("../chat/chat.service");
let EventsGateway = class EventsGateway {
    constructor(prisma, chatService) {
        this.prisma = prisma;
        this.chatService = chatService;
        this.lastUpdate = new Map();
    }
    afterInit(server) {
        console.log('EventsGateway initialized');
    }
    handleConnection(client, ...args) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleSubscribePatient(client, data) {
        const room = `patient_${data.patientId}`;
        client.join(room);
        console.log(`Client ${client.id} subscribed to patient ${data.patientId}`);
        return { event: 'subscribed', data: { room } };
    }
    handleUnsubscribePatient(client, data) {
        const room = `patient_${data.patientId}`;
        client.leave(room);
        console.log(`Client ${client.id} unsubscribed from patient ${data.patientId}`);
        return { event: 'unsubscribed', data: { room } };
    }
    async handleSimulateVitals(client, data) {
        let patientId = data.patientId;
        if (!patientId && data.email) {
            const patient = await this.prisma.patient.findFirst({
                where: { user: { email: data.email } },
            });
            if (patient) {
                patientId = patient.id;
            }
        }
        if (!patientId) {
            console.error('❌ No patientId in vitals data');
            return;
        }
        data.patientId = patientId;
        console.log('📊 VITALS RECEIVED:', JSON.stringify(data, null, 2));
        console.log(`📡 Broadcasting to room: patient_${patientId}`);
        this.server.to(`patient_${patientId}`).emit('vitals.update', data);
        console.log('✅ Vitals broadcast complete');
        const now = Date.now();
        const last = this.lastUpdate.get(patientId) || 0;
        if (now - last > 5000) {
            this.lastUpdate.set(patientId, now);
            try {
                await this.prisma.patient.update({
                    where: { id: parseInt(patientId) },
                    data: { latestVitals: data }
                });
            }
            catch (e) {
                console.error(`Failed to persist vitals snapshot for patient ${patientId}`, e);
            }
        }
    }
    handlePatientEmergency(client, data) {
        console.log(`[EMERGENCY] Received alert for Patient ${data.patientId}:`, data);
        if (data && data.patientId) {
            this.server.to(`patient_${data.patientId}`).emit('patient.emergency', data);
            console.log(`[EMERGENCY] Broadcasted to room patient_${data.patientId}`);
        }
    }
    handleSendMessage(client, data) {
        console.log(`[CHAT] Message from ${data.senderId} to ${data.recipientId}: ${data.message}`);
        const savedMessage = this.chatService.addMessage(data.senderId, data.recipientId, data.message);
        this.server.to(`user_${data.recipientId}`).emit('receiveMessage', savedMessage);
        client.emit('receiveMessage', savedMessage);
        return { success: true, message: savedMessage };
    }
    handleSubscribeUser(client, data) {
        const room = `user_${data.userId}`;
        client.join(room);
        console.log(`Client ${client.id} subscribed to user ${data.userId}`);
        return { event: 'user.subscribed', data: { room } };
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe.patient'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribePatient", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe.patient'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleUnsubscribePatient", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('simulate_vitals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleSimulateVitals", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('patient.emergency'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handlePatientEmergency", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe.user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribeUser", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_service_1.ChatService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map