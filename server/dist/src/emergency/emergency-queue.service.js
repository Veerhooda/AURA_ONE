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
var EmergencyQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyQueueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmergencyQueueService = EmergencyQueueService_1 = class EmergencyQueueService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(EmergencyQueueService_1.name);
    }
    async getActiveQueue(userId) {
        const alerts = await this.prisma.emergencyAlert.findMany({
            where: {
                acknowledgedAt: null,
                resolved: false,
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
            orderBy: [
                {
                    severity: 'desc',
                },
                {
                    triggeredAt: 'asc',
                },
            ],
        });
        const severityPriority = {
            CRITICAL: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1,
        };
        return alerts.sort((a, b) => {
            const aPriority = severityPriority[a.severity] || 0;
            const bPriority = severityPriority[b.severity] || 0;
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            return a.triggeredAt.getTime() - b.triggeredAt.getTime();
        });
    }
    async getNextEmergency() {
        const queue = await this.getActiveQueue(0);
        return queue.length > 0 ? queue[0] : null;
    }
    async getQueueCount() {
        return this.prisma.emergencyAlert.count({
            where: {
                acknowledgedAt: null,
                resolved: false,
            },
        });
    }
    async acknowledgeAndNext(alertId, userId) {
        await this.prisma.emergencyAlert.update({
            where: { id: alertId },
            data: {
                acknowledgedBy: userId,
                acknowledgedAt: new Date(),
            },
        });
        this.logger.log(`✅ Emergency ${alertId} acknowledged, fetching next in queue`);
        return this.getNextEmergency();
    }
};
exports.EmergencyQueueService = EmergencyQueueService;
exports.EmergencyQueueService = EmergencyQueueService = EmergencyQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmergencyQueueService);
//# sourceMappingURL=emergency-queue.service.js.map