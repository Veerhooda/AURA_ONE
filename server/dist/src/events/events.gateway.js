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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const vitals_validation_service_1 = require("../vitals/vitals-validation.service");
const emergency_alert_dto_1 = require("./dto/emergency-alert.dto");
const emergency_service_1 = require("../emergency/emergency.service");
let EventsGateway = class EventsGateway {
    constructor(prisma, jwtService, vitalsValidation, emergencyService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.vitalsValidation = vitalsValidation;
        this.emergencyService = emergencyService;
        this.lastUpdate = new Map();
    }
    afterInit(server) {
        console.log('EventsGateway initialized');
    }
    handleConnection(client, ...args) {
        var _a;
        try {
            console.log(`🔌 Connection attempt: ${client.id}`);
            const token = client.handshake.auth.token || ((_a = client.handshake.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
            if (!token) {
                console.warn(`❌ Client ${client.id} missing token. Query:`, client.handshake.query);
                console.warn(`❌ Client ${client.id} attempted connection without token`);
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            client.data.user = {
                userId: payload.sub,
                email: payload.email,
                role: payload.role,
                doctorId: payload.doctorId,
            };
            console.log(`✅ Client ${client.id} connected as ${payload.role} (${payload.email})`);
        }
        catch (error) {
            console.error(`❌ Invalid token for client ${client.id}:`, error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleSubscribePatient(client, data) {
        const user = client.data.user;
        if (!user) {
            client.emit('error', { message: 'Unauthorized: No user context' });
            return;
        }
        const patientId = data.patientId;
        let authorized = false;
        if (user.role === 'DOCTOR' || user.role === 'NURSE' || user.role === 'ADMIN') {
            authorized = true;
        }
        else if (user.role === 'PATIENT') {
            const patient = await this.prisma.patient.findFirst({
                where: { userId: user.userId }
            });
            authorized = patient && patient.id === patientId;
        }
        else if (user.role === 'FAMILY') {
            const relation = await this.prisma.userPatientRelation.findFirst({
                where: {
                    userId: user.userId,
                    patientId: patientId,
                }
            });
            authorized = !!relation;
        }
        if (!authorized) {
            console.warn(`⚠️  User ${user.email} (${user.role}) denied access to patient ${patientId}`);
            client.emit('error', { message: 'Unauthorized: Access denied to this patient' });
            return;
        }
        const room = `patient_${patientId}`;
        client.join(room);
        console.log(`✅ Client ${client.id} (${user.role}) subscribed to patient ${patientId}`);
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
        const validation = this.vitalsValidation.validate(data);
        if (!validation.isValid) {
            console.error(`❌ Invalid vitals data for patient ${patientId}:`, validation.errors);
            client.emit('error', {
                message: 'Invalid vitals data',
                errors: validation.errors
            });
            return;
        }
        if (validation.warnings.length > 0) {
            console.warn(`⚠️  Vitals warnings for patient ${patientId}:`, validation.warnings);
        }
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
                console.error(`🚨 Failed to persist vitals for patient ${patientId}`, e);
            }
        }
    }
    async handlePatientEmergency(client, data) {
        console.log(`[EMERGENCY] Received alert for Patient ${data.patientId}:`, data);
        if (data && data.patientId) {
            this.server.to(`patient_${data.patientId}`).emit('patient.emergency', data);
            console.log(`[EMERGENCY] Broadcasted to room patient_${data.patientId}`);
        }
    }
    handleSubscribeUser(client, data) {
        const room = `user_${data.userId}`;
        client.join(room);
        console.log(`Client ${client.id} subscribed to user ${data.userId}`);
        return { event: 'user.subscribed', data: { room } };
    }
    broadcastVitals(patientId, data) {
        this.server.to(`patient_${patientId}`).emit('vitals.update', data);
        console.log(`📡 Broadcasted vitals for patient ${patientId} from generic source`);
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
    __metadata("design:returntype", Promise)
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
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, emergency_alert_dto_1.EmergencyAlertDto]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handlePatientEmergency", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe.user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribeUser", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || '*',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        vitals_validation_service_1.VitalsValidationService,
        emergency_service_1.EmergencyService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map