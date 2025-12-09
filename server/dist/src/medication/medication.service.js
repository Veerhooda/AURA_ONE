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
exports.MedicationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MedicationService = class MedicationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllMedications() {
        return this.prisma.medication.findMany();
    }
    async createMedication(data) {
        return this.prisma.medication.create({ data });
    }
    async getPatientPrescriptions(patientId) {
        return this.prisma.prescription.findMany({
            where: { patientId, active: true },
            include: { medication: true },
        });
    }
    async prescribe(patientId, medicationId, dosage, frequency) {
        const currentMeds = await this.prisma.prescription.findMany({
            where: { patientId, active: true },
            include: { medication: true },
        });
        const newMed = await this.prisma.medication.findUnique({ where: { id: medicationId } });
        if (!newMed)
            throw new common_1.NotFoundException('Medication not found');
        const warnings = [];
        for (const p of currentMeds) {
            if (p.medication.interactions && p.medication.interactions.includes(newMed.name)) {
                warnings.push(`Warning: ${newMed.name} may interact with ${p.medication.name}`);
            }
            if (newMed.interactions && newMed.interactions.includes(p.medication.name)) {
                warnings.push(`Warning: ${newMed.name} may interact with ${p.medication.name}`);
            }
        }
        const prescription = await this.prisma.prescription.create({
            data: {
                patientId,
                medicationId,
                dosage,
                frequency,
                startDate: new Date(),
            },
        });
        return { prescription, warnings };
    }
};
exports.MedicationService = MedicationService;
exports.MedicationService = MedicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MedicationService);
//# sourceMappingURL=medication.service.js.map