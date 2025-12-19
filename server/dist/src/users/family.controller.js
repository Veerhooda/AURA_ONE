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
const bcrypt = require("bcrypt");
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
        return relations.map(r => {
            var _a;
            return ({
                relation: r.relation,
                patientId: r.patientId,
                name: r.patient.user.name,
                email: r.patient.user.email,
                ward: r.patient.ward,
                lastVitals: r.patient.vitals[0] || null,
                activeAlerts: r.patient.alerts.length,
                status: this._determineStatus(r.patient.vitals[0]),
                lastSeen: ((_a = r.patient.vitals[0]) === null || _a === void 0 ? void 0 : _a.timestamp) || r.patient.updatedAt
            });
        });
    }
    async createFamilyPatient(req, body) {
        const familyUserId = req.user.userId;
        const existing = await this.prisma.user.findUnique({
            where: { email: body.email }
        });
        if (existing) {
            throw new common_1.HttpException('Email already registered', common_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const result = await this.prisma.$transaction(async (prisma) => {
            const patient = await prisma.patient.create({
                data: {
                    mrn: body.mrn,
                    dob: new Date(body.dob),
                    gender: body.gender,
                    weight: body.weight,
                    user: {
                        create: {
                            name: body.name,
                            email: body.email,
                            password: hashedPassword,
                            role: 'PATIENT'
                        }
                    }
                },
                include: { user: true }
            });
            await prisma.userPatientRelation.create({
                data: {
                    userId: familyUserId,
                    patientId: patient.id,
                    relation: body.relationship
                }
            });
            return patient;
        });
        return {
            success: true,
            patientId: result.id,
            userId: result.user.id,
            message: 'Patient account created and linked successfully'
        };
    }
    async addExistingPatient(req, body) {
        const userId = req.user.userId;
        const patient = await this.prisma.patient.findUnique({
            where: { id: body.patientId }
        });
        if (!patient) {
            throw new common_1.HttpException('Patient not found', common_1.HttpStatus.NOT_FOUND);
        }
        const existing = await this.prisma.userPatientRelation.findFirst({
            where: {
                userId,
                patientId: body.patientId
            }
        });
        if (existing) {
            throw new common_1.HttpException('Patient already in your family list', common_1.HttpStatus.CONFLICT);
        }
        await this.prisma.userPatientRelation.create({
            data: {
                userId,
                patientId: body.patientId,
                relation: body.relationship
            }
        });
        return {
            success: true,
            message: 'Patient added to family monitoring list'
        };
    }
    async removePatient(req, patientId) {
        const userId = req.user.userId;
        const pId = parseInt(patientId);
        const relation = await this.prisma.userPatientRelation.findFirst({
            where: {
                userId,
                patientId: pId
            }
        });
        if (!relation) {
            throw new common_1.HttpException('Patient not in your monitoring list', common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.userPatientRelation.delete({
            where: { id: relation.id }
        });
        return {
            success: true,
            message: 'Patient removed from monitoring list'
        };
    }
    _determineStatus(vitals) {
        if (!vitals)
            return 'Unknown';
        const hr = vitals.hr || 0;
        const spo2 = vitals.spo2 || 0;
        if (hr < 60 || hr > 100 || spo2 < 95) {
            return 'Critical';
        }
        else if (hr < 70 || hr > 90 || spo2 < 97) {
            return 'Warning';
        }
        return 'Stable';
    }
    async getMyGuardians(patientId) {
        const pId = parseInt(patientId);
        const relations = await this.prisma.userPatientRelation.findMany({
            where: { patientId: pId },
            include: {
                user: true,
            },
        });
        return relations.map(r => ({
            id: r.id,
            name: r.user.name,
            email: r.user.email,
            relationship: r.relation,
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
__decorate([
    (0, common_1.Post)('create-patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new patient account and link to family' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['name', 'email', 'password', 'mrn', 'dob', 'gender', 'relationship'],
            properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                mrn: { type: 'string', description: 'Medical Record Number' },
                dob: { type: 'string', format: 'date' },
                gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
                weight: { type: 'string' },
                relationship: { type: 'string' }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "createFamilyPatient", null);
__decorate([
    (0, common_1.Post)('add-patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Add existing patient to your family monitoring list' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                patientId: { type: 'number' },
                relationship: { type: 'string' }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "addExistingPatient", null);
__decorate([
    (0, common_1.Delete)('remove/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove patient from family monitoring list' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "removePatient", null);
__decorate([
    (0, common_1.Get)('my-guardians/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get family members watching this patient (for patient profile)' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getMyGuardians", null);
exports.FamilyController = FamilyController = __decorate([
    (0, swagger_1.ApiTags)('family'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('family'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FamilyController);
//# sourceMappingURL=family.controller.js.map