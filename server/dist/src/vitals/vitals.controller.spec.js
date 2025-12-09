"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const vitals_controller_1 = require("./vitals.controller");
describe('VitalsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [vitals_controller_1.VitalsController],
        }).compile();
        controller = module.get(vitals_controller_1.VitalsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=vitals.controller.spec.js.map