"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const vitals_service_1 = require("./vitals.service");
describe('VitalsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [vitals_service_1.VitalsService],
        }).compile();
        service = module.get(vitals_service_1.VitalsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=vitals.service.spec.js.map