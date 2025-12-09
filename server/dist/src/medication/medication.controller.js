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
exports.MedicationController = void 0;
const common_1 = require("@nestjs/common");
const medication_service_1 = require("./medication.service");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
let MedicationController = class MedicationController {
    constructor(medicationService) {
        this.medicationService = medicationService;
    }
    getAll() {
        return this.medicationService.getAllMedications();
    }
    getPrescriptions(id) {
        return this.medicationService.getPatientPrescriptions(id);
    }
    prescribe(patientId, body) {
        return this.medicationService.prescribe(patientId, body.medicationId, body.dosage, body.frequency);
    }
};
exports.MedicationController = MedicationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all available medications' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MedicationController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('patient/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active prescriptions for a patient' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MedicationController.prototype, "getPrescriptions", null);
__decorate([
    (0, common_1.Post)('prescribe/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Prescribe medication to patient (with interaction check)' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MedicationController.prototype, "prescribe", null);
exports.MedicationController = MedicationController = __decorate([
    (0, swagger_1.ApiTags)('medication'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('medication'),
    __metadata("design:paramtypes", [medication_service_1.MedicationService])
], MedicationController);
//# sourceMappingURL=medication.controller.js.map