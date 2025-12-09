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
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let EventsGateway = class EventsGateway {
    constructor() {
        this.activeSessions = new Map();
    }
    onModuleInit() {
        console.log('EventsGateway initialized');
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.stopStreaming(client.id);
    }
    handleSubscribePatient(data, client) {
        console.log(`Client ${client.id} subscribed to patient ${data.patientId}`);
        this.startStreaming(client.id, data.patientId);
        return { event: 'subscribed', data: data.patientId };
    }
    handleUnsubscribePatient(client) {
        this.stopStreaming(client.id);
        return { event: 'unsubscribed' };
    }
    startStreaming(clientId, patientId) {
        if (this.activeSessions.has(clientId)) {
            clearInterval(this.activeSessions.get(clientId));
        }
        let time = 0;
        const interval = setInterval(() => {
            const heartRate = 60 + Math.sin(time * 0.1) * 10;
            const ecgValue = this.simulateECG(time);
            this.server.to(clientId).emit('vitals.update', {
                patientId,
                timestamp: Date.now(),
                ecg: ecgValue,
                spo2: 98 + Math.random() * 2 - 1,
                heartRate: Math.round(heartRate),
            });
            time += 0.05;
        }, 50);
        this.activeSessions.set(clientId, interval);
    }
    stopStreaming(clientId) {
        if (this.activeSessions.has(clientId)) {
            clearInterval(this.activeSessions.get(clientId));
            this.activeSessions.delete(clientId);
        }
    }
    simulateECG(t) {
        const cycle = t % (2 * Math.PI);
        let y = 0;
        if (cycle > 0 && cycle < 0.5)
            y += 0.2 * Math.sin(cycle * 10);
        if (cycle > 0.6 && cycle < 0.8)
            y -= 1.0 * Math.sin(cycle * 20);
        if (cycle > 0.8 && cycle < 1.0)
            y += 5.0 * Math.sin(cycle * 50);
        if (cycle > 1.0 && cycle < 1.2)
            y -= 1.5 * Math.sin(cycle * 20);
        if (cycle > 1.4 && cycle < 2.0)
            y += 0.4 * Math.sin(cycle * 5);
        y += (Math.random() - 0.5) * 0.1;
        return y;
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe.patient'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribePatient", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe.patient'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleUnsubscribePatient", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map