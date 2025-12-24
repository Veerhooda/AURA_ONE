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
exports.CareController = exports.UpdateTaskStatusDto = exports.CreateTaskDto = void 0;
const common_1 = require("@nestjs/common");
const care_service_1 = require("./care.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateTaskDto {
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TaskPriority),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "dueAt", void 0);
class UpdateTaskStatusDto {
}
exports.UpdateTaskStatusDto = UpdateTaskStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TaskStatus),
    __metadata("design:type", String)
], UpdateTaskStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskStatusDto.prototype, "notes", void 0);
let CareController = class CareController {
    constructor(careService) {
        this.careService = careService;
    }
    async getTasksByWard(ward) {
        return this.careService.getTasksForWard(ward || 'General');
    }
    async getTasks(ward) {
        return this.careService.getTasksForWard(ward || 'General');
    }
    async createTask(req, body) {
        return this.careService.createManualTask(req.user.userId, body);
    }
    async updateTask(id, body) {
        return this.careService.updateTaskStatus(parseInt(id), body.status, body.notes);
    }
};
exports.CareController = CareController;
__decorate([
    (0, common_1.Get)('ward'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prioritized tasks for a specific ward' }),
    __param(0, (0, common_1.Query)('ward')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareController.prototype, "getTasksByWard", null);
__decorate([
    (0, common_1.Get)('task'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all care tasks (alias for ward tasks for now)' }),
    __param(0, (0, common_1.Query)('ward')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Post)('task'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new manual care task' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateTaskDto]),
    __metadata("design:returntype", Promise)
], CareController.prototype, "createTask", null);
__decorate([
    (0, common_1.Patch)('task/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task status (Complete/Skip)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTaskStatusDto]),
    __metadata("design:returntype", Promise)
], CareController.prototype, "updateTask", null);
exports.CareController = CareController = __decorate([
    (0, swagger_1.ApiTags)('care'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('care'),
    __metadata("design:paramtypes", [care_service_1.CareService])
], CareController);
//# sourceMappingURL=care.controller.js.map