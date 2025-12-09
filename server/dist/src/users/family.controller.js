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
exports.FamilyController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let FamilyController = class FamilyController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyPatients(req) {
        const userId = req.user.userId;
        const relations = await this.prisma.userPatientRelation.findMany({
            where: { userId },
            include: {
                patient: {
                    include: {
                        user: true,
                        vitals: { orderBy: { timestamp: 'desc' }, take: 1 },
                        alerts: { where: { resolved: false } }
                    }
                }
            }
        });
        return relations.map(r => ({
            relation: r.relation,
            patientId: r.patientId,
            name: r.patient.user.name,
            ward: r.patient.ward,
            lastVitals: r.patient.vitals[0] || null,
            activeAlerts: r.patient.alerts.length
        }));
    }
};
exports.FamilyController = FamilyController;
__decorate([
    (0, common_1.Get)('patients'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of patients monitored by the family member' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getMyPatients", null);
exports.FamilyController = FamilyController = __decorate([
    (0, swagger_1.ApiTags)('family'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('family'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FamilyController);
//# sourceMappingURL=family.controller.js.map