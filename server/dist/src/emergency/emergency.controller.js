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
exports.EmergencyController = void 0;
const common_1 = require("@nestjs/common");
const emergency_service_1 = require("./emergency.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const audit_service_1 = require("../audit/audit.service");
let EmergencyController = class EmergencyController {
    constructor(emergencyService, auditService) {
        this.emergencyService = emergencyService;
        this.auditService = auditService;
    }
    async acknowledgeEmergency(body) {
        const { alertId, userId } = body;
        const success = await this.emergencyService.acknowledgeEmergency(alertId, userId);
        if (success) {
            await this.auditService.log(userId, 'DOCTOR', 'ACKNOWLEDGE_EMERGENCY', 'EMERGENCY_ALERT', alertId, { alertId, acknowledgedAt: new Date() });
            return { success: true, message: 'Emergency acknowledged' };
        }
        else {
            return { success: false, message: 'Failed to acknowledge emergency' };
        }
    }
    async getUnacknowledgedAlerts(patientId) {
        return this.emergencyService.getUnacknowledgedAlerts(parseInt(patientId));
    }
    async getAllUnacknowledgedAlerts() {
        return this.emergencyService.getUnacknowledgedAlerts();
    }
};
exports.EmergencyController = EmergencyController;
__decorate([
    (0, common_1.Post)('acknowledge'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "acknowledgeEmergency", null);
__decorate([
    (0, common_1.Get)('unacknowledged/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "getUnacknowledgedAlerts", null);
__decorate([
    (0, common_1.Get)('unacknowledged'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "getAllUnacknowledgedAlerts", null);
exports.EmergencyController = EmergencyController = __decorate([
    (0, common_1.Controller)('emergency'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [emergency_service_1.EmergencyService,
        audit_service_1.AuditService])
], EmergencyController);
//# sourceMappingURL=emergency.controller.js.map