"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const doctor_module_1 = require("./doctor/doctor.module");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const patient_module_1 = require("./patient/patient.module");
const vitals_module_1 = require("./vitals/vitals.module");
const ai_module_1 = require("./ai/ai.module");
const events_module_1 = require("./events/events.module");
const chat_module_1 = require("./chat/chat.module");
const appointments_module_1 = require("./appointments/appointments.module");
const audit_module_1 = require("./audit/audit.module");
const care_module_1 = require("./care/care.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            doctor_module_1.DoctorModule,
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            patient_module_1.PatientModule,
            vitals_module_1.VitalsModule,
            ai_module_1.AiModule,
            events_module_1.EventsModule,
            chat_module_1.ChatModule,
            appointments_module_1.AppointmentsModule,
            audit_module_1.AuditModule,
            care_module_1.CareModule,
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map