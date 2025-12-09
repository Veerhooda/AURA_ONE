"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
describe('AuthController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=auth.controller.spec.js.map