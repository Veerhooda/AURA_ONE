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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CareService = class CareService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createManualTask(userId, data) {
        return this.prisma.careTask.create({
            data: Object.assign(Object.assign({}, data), { creatorId: userId, status: client_1.TaskStatus.PENDING })
        });
    }
    async getTasksForWard(ward) {
        const tasks = await this.prisma.careTask.findMany({
            where: {
                patient: { ward: ward },
                status: { in: [client_1.TaskStatus.PENDING, client_1.TaskStatus.IN_PROGRESS] }
            },
            include: {
                patient: {
                    select: { id: true, user: { select: { name: true } }, bed: true, riskScore: true, latestVitals: true }
                }
            }
        });
        return this._sortTasksByPriority(tasks);
    }
    async updateTaskStatus(taskId, status, notes) {
        return this.prisma.careTask.update({
            where: { id: taskId },
            data: {
                status,
                notes,
                completedAt: status === client_1.TaskStatus.COMPLETED ? new Date() : null
            }
        });
    }
    _sortTasksByPriority(tasks) {
        const now = new Date().getTime();
        return tasks.sort((a, b) => {
            const scoreA = this._calculateScore(a, now);
            const scoreB = this._calculateScore(b, now);
            return scoreB - scoreA;
        });
    }
    _calculateScore(task, now) {
        let score = 0;
        switch (task.priority) {
            case client_1.TaskPriority.CRITICAL:
                score += 1000;
                break;
            case client_1.TaskPriority.HIGH:
                score += 500;
                break;
            case client_1.TaskPriority.ROUTINE:
                score += 100;
                break;
            case client_1.TaskPriority.LOW:
                score += 0;
                break;
        }
        const dueTime = new Date(task.dueAt).getTime();
        const diffMinutes = (now - dueTime) / 60000;
        if (diffMinutes > 0) {
            score += Math.min(diffMinutes * 10, 400);
        }
        else if (diffMinutes > -30) {
            score += 50;
        }
        if (task.patient.riskScore) {
            score += task.patient.riskScore;
        }
        return score;
    }
};
exports.CareService = CareService;
exports.CareService = CareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CareService);
//# sourceMappingURL=care.service.js.map