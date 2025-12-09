"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationModule = void 0;
const common_1 = require("@nestjs/common");
const medication_service_1 = require("./medication.service");
const medication_controller_1 = require("./medication.controller");
let MedicationModule = class MedicationModule {
};
exports.MedicationModule = MedicationModule;
exports.MedicationModule = MedicationModule = __decorate([
    (0, common_1.Module)({
        controllers: [medication_controller_1.MedicationController],
        providers: [medication_service_1.MedicationService],
    })
], MedicationModule);
//# sourceMappingURL=medication.module.js.map