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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AppointmentsService = class AppointmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAppointment(patientId, doctorId, dateTime, type, notes) {
        return this.prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                dateTime,
                type,
                notes,
            },
            include: {
                doctor: true,
                patient: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getPatientAppointments(patientId) {
        return this.prisma.appointment.findMany({
            where: { patientId },
            include: {
                doctor: true,
            },
            orderBy: {
                dateTime: 'asc',
            },
        });
    }
    async getAllDoctors() {
        return this.prisma.doctor.findMany();
    }
    async updateAppointmentStatus(id, status) {
        return this.prisma.appointment.update({
            where: { id },
            data: { status },
        });
    }
    async cancelAppointment(id) {
        return this.updateAppointmentStatus(id, 'cancelled');
    }
    getAvailableSlots(doctorId, date) {
        const slots = [];
        for (let hour = 9; hour < 17; hour++) {
            const slotTime = new Date(date);
            slotTime.setHours(hour, 0, 0, 0);
            slots.push(slotTime.toISOString());
        }
        return slots;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map