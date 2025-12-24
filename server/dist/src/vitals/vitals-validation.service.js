"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalsValidationService = void 0;
const common_1 = require("@nestjs/common");
let VitalsValidationService = class VitalsValidationService {
    constructor() {
        this.VITALS_RANGES = {
            hr: { min: 30, max: 220, unit: 'bpm' },
            spo2: { min: 70, max: 100, unit: '%' },
            systolic: { min: 70, max: 200, unit: 'mmHg' },
            diastolic: { min: 40, max: 130, unit: 'mmHg' },
            temp: { min: 35, max: 42, unit: '°C' },
            respiratoryRate: { min: 8, max: 40, unit: 'breaths/min' },
        };
    }
    validate(vitalsData) {
        const errors = [];
        const warnings = [];
        if (vitalsData.hr !== undefined) {
            if (typeof vitalsData.hr !== 'number') {
                errors.push('Heart rate must be a number');
            }
            else if (vitalsData.hr < this.VITALS_RANGES.hr.min || vitalsData.hr > this.VITALS_RANGES.hr.max) {
                errors.push(`Heart rate ${vitalsData.hr} out of valid range (${this.VITALS_RANGES.hr.min}-${this.VITALS_RANGES.hr.max} ${this.VITALS_RANGES.hr.unit})`);
            }
            else if (vitalsData.hr < 40 || vitalsData.hr > 180) {
                warnings.push(`Heart rate ${vitalsData.hr} ${this.VITALS_RANGES.hr.unit} is unusual - verify reading`);
            }
        }
        if (vitalsData.spo2 !== undefined) {
            if (typeof vitalsData.spo2 !== 'number') {
                errors.push('SpO2 must be a number');
            }
            else if (vitalsData.spo2 < this.VITALS_RANGES.spo2.min || vitalsData.spo2 > this.VITALS_RANGES.spo2.max) {
                errors.push(`SpO2 ${vitalsData.spo2} out of valid range (${this.VITALS_RANGES.spo2.min}-${this.VITALS_RANGES.spo2.max}${this.VITALS_RANGES.spo2.unit})`);
            }
            else if (vitalsData.spo2 < 90) {
                warnings.push(`SpO2 ${vitalsData.spo2}${this.VITALS_RANGES.spo2.unit} is critically low`);
            }
        }
        if (vitalsData.systolic !== undefined || vitalsData.diastolic !== undefined) {
            if (vitalsData.systolic !== undefined) {
                if (typeof vitalsData.systolic !== 'number') {
                    errors.push('Systolic BP must be a number');
                }
                else if (vitalsData.systolic < this.VITALS_RANGES.systolic.min || vitalsData.systolic > this.VITALS_RANGES.systolic.max) {
                    errors.push(`Systolic BP ${vitalsData.systolic} out of valid range`);
                }
            }
            if (vitalsData.diastolic !== undefined) {
                if (typeof vitalsData.diastolic !== 'number') {
                    errors.push('Diastolic BP must be a number');
                }
                else if (vitalsData.diastolic < this.VITALS_RANGES.diastolic.min || vitalsData.diastolic > this.VITALS_RANGES.diastolic.max) {
                    errors.push(`Diastolic BP ${vitalsData.diastolic} out of valid range`);
                }
            }
            if (vitalsData.systolic && vitalsData.diastolic && vitalsData.systolic <= vitalsData.diastolic) {
                errors.push('Systolic BP must be greater than diastolic BP');
            }
        }
        if (vitalsData.temp !== undefined) {
            if (typeof vitalsData.temp !== 'number') {
                errors.push('Temperature must be a number');
            }
            else if (vitalsData.temp < this.VITALS_RANGES.temp.min || vitalsData.temp > this.VITALS_RANGES.temp.max) {
                errors.push(`Temperature ${vitalsData.temp} out of valid range (${this.VITALS_RANGES.temp.min}-${this.VITALS_RANGES.temp.max}${this.VITALS_RANGES.temp.unit})`);
            }
            else if (vitalsData.temp > 39 || vitalsData.temp < 36) {
                warnings.push(`Temperature ${vitalsData.temp}${this.VITALS_RANGES.temp.unit} is abnormal`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    getRanges() {
        return this.VITALS_RANGES;
    }
};
exports.VitalsValidationService = VitalsValidationService;
exports.VitalsValidationService = VitalsValidationService = __decorate([
    (0, common_1.Injectable)()
], VitalsValidationService);
//# sourceMappingURL=vitals-validation.service.js.map