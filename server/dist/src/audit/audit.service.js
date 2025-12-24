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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(userId, userRole, action, entityType, entityId, changes, ipAddress) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId,
                    userRole,
                    action,
                    entityType,
                    entityId,
                    changes,
                    ipAddress,
                },
            });
        }
        catch (error) {
            console.error('🚨 CRITICAL: Audit log write failed:', error);
            throw new Error('Audit logging failed - operation aborted for compliance');
        }
    }
    async getEntityAuditTrail(entityType, entityId) {
        return this.prisma.auditLog.findMany({
            where: { entityType, entityId },
            include: { user: { select: { name: true, email: true, role: true } } },
            orderBy: { timestamp: 'desc' },
        });
    }
    async getUserAuditTrail(userId, limit = 100) {
        return this.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }
    async getActionAuditTrail(action, limit = 100) {
        return this.prisma.auditLog.findMany({
            where: { action },
            include: { user: { select: { name: true, email: true, role: true } } },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map