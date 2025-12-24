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
var EmergencyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmergencyService = EmergencyService_1 = class EmergencyService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(EmergencyService_1.name);
    }
    async createEmergencyAlert(patientId, severity, vitalType, value, notes) {
        const alert = await this.prisma.emergencyAlert.create({
            data: {
                patientId,
                severity,
                vitalType,
                value,
                notes,
            },
        });
        this.logger.warn(`🚨 Emergency Alert Created: ID=${alert.id}, Patient=${patientId}, Severity=${severity}, Type=${vitalType}`);
        return alert.id;
    }
    async markDelivered(alertId, channel) {
        await this.prisma.emergencyAlert.update({
            where: { id: alertId },
            data: {
                deliveredVia: channel,
                deliveredAt: new Date(),
            },
        });
        this.logger.log(`✅ Emergency Alert ${alertId} delivered via ${channel}`);
    }
    async acknowledgeEmergency(alertId, userId) {
        try {
            const alert = await this.prisma.emergencyAlert.findUnique({
                where: { id: alertId },
            });
            if (!alert) {
                this.logger.error(`❌ Emergency Alert ${alertId} not found`);
                return false;
            }
            if (alert.acknowledgedAt) {
                this.logger.log(`ℹ️  Emergency Alert ${alertId} already acknowledged`);
                return true;
            }
            await this.prisma.emergencyAlert.update({
                where: { id: alertId },
                data: {
                    acknowledgedBy: userId,
                    acknowledgedAt: new Date(),
                },
            });
            this.logger.log(`✅ Emergency Alert ${alertId} acknowledged by User ${userId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`❌ Failed to acknowledge Emergency Alert ${alertId}: ${error.message}`);
            return false;
        }
    }
    async getUndeliveredAlerts() {
        return this.prisma.emergencyAlert.findMany({
            where: {
                deliveredAt: null,
                retryCount: { lt: 5 },
            },
            orderBy: { triggeredAt: 'asc' },
        });
    }
    async getUnacknowledgedAlerts(patientId) {
        return this.prisma.emergencyAlert.findMany({
            where: Object.assign({ acknowledgedAt: null }, (patientId && { patientId })),
            orderBy: { triggeredAt: 'desc' },
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
    }
    async incrementRetry(alertId) {
        await this.prisma.emergencyAlert.update({
            where: { id: alertId },
            data: {
                retryCount: { increment: 1 },
                lastRetryAt: new Date(),
            },
        });
    }
    async resolveEmergency(alertId) {
        await this.prisma.emergencyAlert.update({
            where: { id: alertId },
            data: {
                resolved: true,
                resolvedAt: new Date(),
            },
        });
    }
};
exports.EmergencyService = EmergencyService;
exports.EmergencyService = EmergencyService = EmergencyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmergencyService);
//# sourceMappingURL=emergency.service.js.map