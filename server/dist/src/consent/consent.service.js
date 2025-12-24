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
exports.ConsentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConsentService = class ConsentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async hasConsent(guardianId, patientId, consentType) {
        const consent = await this.prisma.patientConsent.findFirst({
            where: {
                guardianId,
                patientId,
                consentType,
                revokedAt: null,
            },
        });
        return !!consent;
    }
    async grantConsent(patientId, guardianId, consentType, grantedBy) {
        const existing = await this.prisma.patientConsent.findFirst({
            where: {
                patientId,
                guardianId,
                consentType,
                revokedAt: null,
            },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.patientConsent.create({
            data: {
                patientId,
                guardianId,
                consentType,
                grantedBy,
            },
        });
    }
    async revokeConsent(patientId, guardianId, consentType) {
        const consent = await this.prisma.patientConsent.findFirst({
            where: {
                patientId,
                guardianId,
                consentType,
                revokedAt: null,
            },
        });
        if (!consent) {
            throw new Error('Consent not found');
        }
        return this.prisma.patientConsent.update({
            where: { id: consent.id },
            data: { revokedAt: new Date() },
        });
    }
    async getPatientConsents(patientId) {
        return this.prisma.patientConsent.findMany({
            where: { patientId, revokedAt: null },
            include: {
                guardian: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async getGuardianConsents(guardianId) {
        return this.prisma.patientConsent.findMany({
            where: { guardianId, revokedAt: null },
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
};
exports.ConsentService = ConsentService;
exports.ConsentService = ConsentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsentService);
//# sourceMappingURL=consent.service.js.map