"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ai_service_1 = require("./ai.service");
describe('AiService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [ai_service_1.AiService],
        }).compile();
        service = module.get(ai_service_1.AiService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=ai.service.spec.js.map