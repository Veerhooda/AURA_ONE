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
exports.EmergencyAlertDto = void 0;
const class_validator_1 = require("class-validator");
class EmergencyAlertDto {
}
exports.EmergencyAlertDto = EmergencyAlertDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], EmergencyAlertDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    __metadata("design:type", String)
], EmergencyAlertDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['HR', 'SPO2', 'BP', 'TEMP', 'FALL', 'MEDICATION']),
    __metadata("design:type", String)
], EmergencyAlertDto.prototype, "vitalType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EmergencyAlertDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyAlertDto.prototype, "notes", void 0);
//# sourceMappingURL=emergency-alert.dto.js.map