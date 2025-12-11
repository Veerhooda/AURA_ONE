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
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PatientService = class PatientService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDigitalTwin(id) {
        var _a, _b, _c, _d, _e, _f;
        const patient = await this.prisma.patient.findUnique({
            where: { id },
            include: {
                vitals: {
                    orderBy: { timestamp: 'desc' },
                    take: 10,
                },
                user: {
                    select: { name: true, email: true },
                },
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const riskScore = patient.riskScore || 0;
        const aiPredictions = {
            hypotension_6h: riskScore > 50 ? 0.6 : 0.1,
            cardiac_event_24h: riskScore > 80 ? 0.4 : 0.05,
            deterioration_prob: riskScore / 100,
        };
        const lv = patient.latestVitals;
        return {
            metadata: {
                name: patient.user.name,
                mrn: patient.mrn,
                bed: patient.bed,
                ward: patient.ward,
            },
            current_state: {
                heart_rate: (_a = lv === null || lv === void 0 ? void 0 : lv.hr) !== null && _a !== void 0 ? _a : (_b = this.getLatestVital(patient.vitals, 'HR')) === null || _b === void 0 ? void 0 : _b.value,
                blood_pressure: (_c = lv === null || lv === void 0 ? void 0 : lv.bp) !== null && _c !== void 0 ? _c : (_d = this.getLatestVital(patient.vitals, 'BP')) === null || _d === void 0 ? void 0 : _d.value,
                spo2: (_e = lv === null || lv === void 0 ? void 0 : lv.spo2) !== null && _e !== void 0 ? _e : (_f = this.getLatestVital(patient.vitals, 'SPO2')) === null || _f === void 0 ? void 0 : _f.value,
                risk_score: riskScore,
                pain_level: patient.painLevel,
                pain_reported_at: patient.painReportedAt,
            },
            risk_predictions: aiPredictions,
            trend_summary: [
                "Stable heart rate over last 4 hours",
                riskScore > 50 ? " elevated risk detected" : "No active alerts"
            ]
        };
    }
    getLatestVital(vitals, type) {
        const v = vitals.find(v => v.type === type);
        return v ? { value: v.value, unit: v.unit, time: v.timestamp } : null;
    }
    async createPatient(data) {
        return this.prisma.patient.create({ data });
    }
    async findAll() {
        return this.prisma.patient.findMany({ include: { user: true } });
    }
    async reportPain(patientId, level) {
        return this.prisma.patient.update({
            where: { id: patientId },
            data: {
                painLevel: level,
                painReportedAt: new Date()
            }
        });
    }
    async updateProfileByUserId(userId, data) {
        const existing = await this.prisma.patient.findFirst({ where: { userId } });
        if (existing) {
            return this.prisma.patient.update({
                where: { id: existing.id },
                data: {
                    weight: data.weight,
                    status: data.status,
                    symptoms: data.symptoms,
                    mrn: existing.mrn || `MRN-${Date.now()}`
                }
            });
        }
        else {
            return this.prisma.patient.create({
                data: {
                    userId,
                    mrn: `MRN-${Date.now().toString().substring(6)}`,
                    dob: new Date('1990-01-01'),
                    gender: 'Unknown',
                    weight: data.weight || '70 kg',
                    status: data.status || 'Admitted',
                    symptoms: data.symptoms || 'None recorded',
                    bed: 'Unassigned',
                    ward: 'General',
                }
            });
        }
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientService);
//# sourceMappingURL=patient.service.js.map