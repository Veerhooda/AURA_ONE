"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const navigation_service_1 = require("./navigation.service");
describe('NavigationService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [navigation_service_1.NavigationService],
        }).compile();
        service = module.get(navigation_service_1.NavigationService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=navigation.service.spec.js.map