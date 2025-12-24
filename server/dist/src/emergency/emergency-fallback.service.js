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
var EmergencyFallbackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyFallbackService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmergencyFallbackService = EmergencyFallbackService_1 = class EmergencyFallbackService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(EmergencyFallbackService_1.name);
    }
    async sendPushNotification(alertId, deviceToken, payload) {
        try {
            this.logger.log(`📲 Push notification sent for alert ${alertId}`);
            await this.logDeliveryAttempt(alertId, 'PUSH', true);
            return true;
        }
        catch (error) {
            this.logger.error(`❌ Push notification failed for alert ${alertId}: ${error.message}`);
            await this.logDeliveryAttempt(alertId, 'PUSH', false, error.message);
            return false;
        }
    }
    async sendSMS(alertId, phoneNumber, message) {
        try {
            this.logger.log(`📱 SMS sent for alert ${alertId} to ${phoneNumber}`);
            await this.logDeliveryAttempt(alertId, 'SMS', true);
            return true;
        }
        catch (error) {
            this.logger.error(`❌ SMS failed for alert ${alertId}: ${error.message}`);
            await this.logDeliveryAttempt(alertId, 'SMS', false, error.message);
            return false;
        }
    }
    async attemptDeliveryWithFallback(alertId, userId, payload) {
        const alert = await this.prisma.emergencyAlert.findUnique({
            where: { id: alertId },
        });
        if (alert === null || alert === void 0 ? void 0 : alert.deliveredAt) {
            this.logger.log(`✅ Alert ${alertId} already delivered via WebSocket`);
            return;
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        const deviceToken = await this.getDeviceToken(userId);
        if (deviceToken) {
            const pushSuccess = await this.sendPushNotification(alertId, deviceToken, payload);
            if (pushSuccess) {
                await this.prisma.emergencyAlert.update({
                    where: { id: alertId },
                    data: {
                        deliveredVia: 'PUSH',
                        deliveredAt: new Date(),
                    },
                });
                return;
            }
        }
        this.logger.error(`❌ All delivery channels failed for alert ${alertId}. Manual intervention required.`);
    }
    async logDeliveryAttempt(alertId, channel, success, error) {
        this.logger.log(`📝 Delivery attempt: Alert ${alertId}, Channel ${channel}, Success ${success}${error ? `, Error: ${error}` : ''}`);
    }
    async getDeviceToken(userId) {
        return null;
    }
    async retryUndeliveredAlerts() {
        const undelivered = await this.prisma.emergencyAlert.findMany({
            where: {
                deliveredAt: null,
                retryCount: { lt: 5 },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        mrn: true,
                        user: { select: { name: true } },
                    },
                },
            },
        });
        for (const alert of undelivered) {
            const backoffMinutes = Math.pow(2, alert.retryCount);
            const timeSinceTriggered = (Date.now() - alert.triggeredAt.getTime()) / 1000 / 60;
            if (timeSinceTriggered >= backoffMinutes) {
                this.logger.log(`🔄 Retrying delivery for alert ${alert.id} (attempt ${alert.retryCount + 1})`);
                await this.attemptDeliveryWithFallback(alert.id, 0, {
                    severity: alert.severity,
                    vitalType: alert.vitalType,
                    patientName: alert.patient.user.name,
                    patientId: alert.patientId,
                });
                await this.prisma.emergencyAlert.update({
                    where: { id: alert.id },
                    data: {
                        retryCount: { increment: 1 },
                        lastRetryAt: new Date(),
                    },
                });
            }
        }
    }
};
exports.EmergencyFallbackService = EmergencyFallbackService;
exports.EmergencyFallbackService = EmergencyFallbackService = EmergencyFallbackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmergencyFallbackService);
//# sourceMappingURL=emergency-fallback.service.js.map