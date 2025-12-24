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
const axios_1 = require("axios");
const events_gateway_1 = require("../events/events.gateway");
let PatientService = class PatientService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async generateRecoveryGraph(id) {
        const patient = await this.prisma.patient.findUnique({
            where: { id },
            include: { user: true }
        });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        const history = [
            { visit_date: "2024-12-01", severity_score: 8 },
            { visit_date: "2024-12-05", severity_score: 7 },
            { visit_date: "2024-12-10", severity_score: 5 },
            { visit_date: "2024-12-15", severity_score: 3 },
            { visit_date: "Today", severity_score: patient.status === 'Critical' ? 9 : 2 }
        ];
        const payload = {
            patient_name: patient.user.name,
            patient_id: `P${patient.id.toString().padStart(3, '0')}`,
            current_symptoms: patient.symptoms || " recovering",
            patient_history: history
        };
        try {
            const n8nWebhookUrl = 'http://localhost:5678/webhook/generate-summary';
            const response = await axios_1.default.post(n8nWebhookUrl, payload);
            console.log("DEBUG: n8n Response Status:", response.status);
            console.log("DEBUG: n8n Response Data:", JSON.stringify(response.data, null, 2));
            return {
                summary: response.data.medical_summary || "No summary available.",
                recovery_graph_url: response.data.image_data,
            };
        }
        catch (error) {
            console.error("n8n Webhook Error:", error.message);
            return {
                summary: "Could not generate AI summary. Ensure n8n is running.",
                recovery_graph_url: null
            };
        }
    }
    async getDigitalTwin(id) {
        var _a;
        const patient = await this.prisma.patient.findUnique({
            where: { id },
            include: {
                user: true,
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
                name: ((_a = patient.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                mrn: patient.mrn,
                bed: patient.bed,
                ward: patient.ward,
                weight: patient.weight,
                symptoms: patient.symptoms,
            },
            status: patient.status || 'Discharged',
            diagnosis: patient.diagnosis || '',
            current_state: {
                heart_rate: (lv === null || lv === void 0 ? void 0 : lv.hr) || 'N/A',
                blood_pressure: (lv === null || lv === void 0 ? void 0 : lv.bp) || 'N/A',
                spo2: (lv === null || lv === void 0 ? void 0 : lv.spo2) || 'N/A',
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
    async updateStatus(id, status) {
        return this.prisma.patient.update({
            where: { id },
            data: { status }
        });
    }
    async addMedication(patientId, data) {
        throw new Error('Medication creation not yet implemented');
    }
    async addHistory(id, note) {
        const patient = await this.prisma.patient.findUnique({ where: { id } });
        const newEntry = `[${new Date().toISOString().split('T')[0]}] ${note}`;
        const updatedHistory = patient.diagnosis ? `${patient.diagnosis}\n${newEntry}` : newEntry;
        return this.prisma.patient.update({
            where: { id },
            data: { diagnosis: updatedHistory }
        });
    }
    async getPatientMedications(patientId) {
        return [];
    }
    async getPatientHistory(patientId) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
            select: { diagnosis: true }
        });
        if (!(patient === null || patient === void 0 ? void 0 : patient.diagnosis)) {
            return [];
        }
        const entries = patient.diagnosis.split('\n').filter(line => line.trim());
        return entries.map(entry => {
            const match = entry.match(/^\[([\d-]+)\]\s*(.+)$/);
            if (match) {
                const [, date, rest] = match;
                const colonIndex = rest.indexOf(':');
                if (colonIndex > 0) {
                    const type = rest.substring(0, colonIndex).trim();
                    const note = rest.substring(colonIndex + 1).trim();
                    return {
                        date,
                        type,
                        note
                    };
                }
                return { date, type: 'Note', note: rest.trim() };
            }
            return {
                date: new Date().toISOString().split('T')[0],
                type: 'Note',
                note: entry.trim()
            };
        });
    }
    async getPatientReports(patientId) {
        return [
            {
                id: 1,
                name: 'Blood Test Report.pdf',
                type: 'PDF',
                date: '2023-10-25',
                size: '1.2 MB',
                url: 'https://example.com/report1.pdf'
            },
            {
                id: 2,
                name: 'Chest X-Ray.jpg',
                type: 'IMAGE',
                date: '2023-11-02',
                size: '3.5 MB',
                url: 'https://example.com/xray.jpg'
            },
            {
                id: 3,
                name: 'MRI Scan - Head.zip',
                type: 'ZIP',
                date: '2023-12-10',
                size: '15.0 MB',
                url: 'https://example.com/mri.zip'
            }
        ];
    }
    async uploadReport(patientId, fileName, fileType) {
        return {
            message: 'File uploaded successfully',
            fileId: Math.floor(Math.random() * 1000)
        };
    }
    async addManualVital(patientId, type, value, unit) {
        const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
        const currentVitals = patient.latestVitals || {};
        const newVitals = Object.assign(Object.assign({}, currentVitals), { [type.toLowerCase()]: value });
        if (type === 'heart_rate')
            newVitals['hr'] = value;
        if (type === 'spo2')
            newVitals['spo2'] = value;
        if (type === 'blood_pressure_systolic')
            newVitals['bp_sys'] = value;
        if (type === 'blood_pressure_diastolic')
            newVitals['bp_dia'] = value;
        if (newVitals['bp_sys'] && newVitals['bp_dia']) {
            newVitals['bp'] = `${newVitals['bp_sys']}/${newVitals['bp_dia']}`;
        }
        newVitals.timestamp = new Date().toISOString();
        await this.prisma.patient.update({
            where: { id: patientId },
            data: { latestVitals: newVitals }
        });
        this.eventsGateway.broadcastVitals(patientId, newVitals);
        return { success: true };
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], PatientService);
//# sourceMappingURL=patient.service.js.map