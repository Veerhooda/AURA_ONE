"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const patient_service_1 = require("./patient.service");
describe('PatientService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [patient_service_1.PatientService],
        }).compile();
        service = module.get(patient_service_1.PatientService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=patient.service.spec.js.map