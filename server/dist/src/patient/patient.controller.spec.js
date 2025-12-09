"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const patient_controller_1 = require("./patient.controller");
describe('PatientController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [patient_controller_1.PatientController],
        }).compile();
        controller = module.get(patient_controller_1.PatientController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=patient.controller.spec.js.map