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
var ConflictAuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictAuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConflictAuditService = ConflictAuditService_1 = class ConflictAuditService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ConflictAuditService_1.name);
    }
    async logConflictDetection(userId, userRole, entityType, entityId, expectedVersion, currentVersion, conflictFields, yourData, serverData, ipAddress) {
        const log = await this.prisma.conflictResolutionLog.create({
            data: {
                userId,
                userRole,
                entityType,
                entityId,
                expectedVersion,
                currentVersion,
                conflictFields,
                yourData,
                serverData,
                resolvedData: {},
                detectedAt: new Date(),
                resolvedAt: new Date(),
                ipAddress,
            },
        });
        this.logger.warn(`⚠️  CONFLICT DETECTED: User ${userId} (${userRole}) on ${entityType} ${entityId}. Expected v${expectedVersion}, Current v${currentVersion}. Fields: ${conflictFields.join(', ')}`);
        return log.id;
    }
    async logConflictResolution(conflictLogId, resolvedData) {
        await this.prisma.conflictResolutionLog.update({
            where: { id: conflictLogId },
            data: {
                resolvedData,
                resolvedAt: new Date(),
            },
        });
        this.logger.log(`✅ CONFLICT RESOLVED: Log ${conflictLogId}. Resolution saved.`);
    }
    async getConflictHistory(entityType, entityId) {
        return this.prisma.conflictResolutionLog.findMany({
            where: {
                entityType,
                entityId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { detectedAt: 'desc' },
        });
    }
    async getConflictStats(startDate, endDate) {
        const conflicts = await this.prisma.conflictResolutionLog.findMany({
            where: {
                detectedAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        return {
            total: conflicts.length,
            byEntityType: this.groupBy(conflicts, 'entityType'),
            byUser: this.groupBy(conflicts, 'userId'),
            avgResolutionTime: this.calculateAvgResolutionTime(conflicts),
        };
    }
    groupBy(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            result[group] = (result[group] || 0) + 1;
            return result;
        }, {});
    }
    calculateAvgResolutionTime(conflicts) {
        if (conflicts.length === 0)
            return 0;
        const totalMs = conflicts.reduce((sum, conflict) => {
            const detected = new Date(conflict.detectedAt).getTime();
            const resolved = new Date(conflict.resolvedAt).getTime();
            return sum + (resolved - detected);
        }, 0);
        return totalMs / conflicts.length / 1000;
    }
};
exports.ConflictAuditService = ConflictAuditService;
exports.ConflictAuditService = ConflictAuditService = ConflictAuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConflictAuditService);
//# sourceMappingURL=conflict-audit.service.js.map