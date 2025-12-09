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
        return {
            metadata: {
                name: patient.user.name,
                mrn: patient.mrn,
                bed: patient.bed,
                ward: patient.ward,
            },
            current_state: {
                heart_rate: this.getLatestVital(patient.vitals, 'HR'),
                blood_pressure: this.getLatestVital(patient.vitals, 'BP'),
                spo2: this.getLatestVital(patient.vitals, 'SPO2'),
                risk_score: riskScore,
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
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientService);
//# sourceMappingURL=patient.service.js.map