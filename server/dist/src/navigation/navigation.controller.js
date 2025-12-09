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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationController = void 0;
const common_1 = require("@nestjs/common");
const navigation_service_1 = require("./navigation.service");
let NavigationController = class NavigationController {
    constructor(navigationService) {
        this.navigationService = navigationService;
    }
    async findPath(from, to) {
        const fromId = parseInt(from);
        const toId = parseInt(to);
        if (isNaN(fromId) || isNaN(toId)) {
            throw new common_1.BadRequestException('Invalid start or end node ID');
        }
        return this.navigationService.findPath(fromId, toId);
    }
    async getMap() {
        return this.navigationService.getMap();
    }
    async createNode(data) {
        return this.navigationService.createNode(data);
    }
    async createEdge(data) {
        return this.navigationService.createEdge(data);
    }
};
exports.NavigationController = NavigationController;
__decorate([
    (0, common_1.Get)('path'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "findPath", null);
__decorate([
    (0, common_1.Get)('map'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getMap", null);
__decorate([
    (0, common_1.Post)('node'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "createNode", null);
__decorate([
    (0, common_1.Post)('edge'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "createEdge", null);
exports.NavigationController = NavigationController = __decorate([
    (0, common_1.Controller)('navigation'),
    __metadata("design:paramtypes", [navigation_service_1.NavigationService])
], NavigationController);
//# sourceMappingURL=navigation.controller.js.map