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
exports.NavigationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NavigationService = class NavigationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPath(fromId, toId) {
        var _a, _b;
        const nodes = await this.prisma.mapNode.findMany();
        const edges = await this.prisma.mapEdge.findMany({ where: { isAccessible: true } });
        if (!nodes.find(n => n.id === fromId) || !nodes.find(n => n.id === toId)) {
            throw new common_1.NotFoundException('Start or End node not found');
        }
        const graph = new Map();
        nodes.forEach(n => graph.set(n.id, []));
        for (const e of edges) {
            if (!graph.has(e.fromId))
                graph.set(e.fromId, []);
            if (!graph.has(e.toId))
                graph.set(e.toId, []);
            (_a = graph.get(e.fromId)) === null || _a === void 0 ? void 0 : _a.push({ to: e.toId, weight: e.weight });
            (_b = graph.get(e.toId)) === null || _b === void 0 ? void 0 : _b.push({ to: e.fromId, weight: e.weight });
        }
        const distances = new Map();
        const previous = new Map();
        const pq = new Set();
        nodes.forEach(n => {
            distances.set(n.id, Infinity);
            pq.add(n.id);
        });
        distances.set(fromId, 0);
        while (pq.size > 0) {
            let minNode = null;
            for (const nodeId of pq) {
                if (minNode === null || distances.get(nodeId) < distances.get(minNode)) {
                    minNode = nodeId;
                }
            }
            if (minNode === null || distances.get(minNode) === Infinity)
                break;
            if (minNode === toId)
                break;
            pq.delete(minNode);
            const neighbors = graph.get(minNode) || [];
            for (const neighbor of neighbors) {
                const alt = distances.get(minNode) + neighbor.weight;
                if (alt < distances.get(neighbor.to)) {
                    distances.set(neighbor.to, alt);
                    previous.set(neighbor.to, minNode);
                }
            }
        }
        const path = [];
        let current = toId;
        if (previous.has(current) || current === fromId) {
            while (current !== undefined) {
                path.unshift(current);
                current = previous.get(current);
            }
        }
        if (path.length === 0 || path[0] !== fromId) {
            throw new common_1.BadRequestException('No path found between these locations');
        }
        const pathNodes = await Promise.all(path.map(id => this.prisma.mapNode.findUnique({ where: { id } })));
        return {
            path: pathNodes,
            distance: distances.get(toId)
        };
    }
    async getMap() {
        return {
            nodes: await this.prisma.mapNode.findMany(),
            edges: await this.prisma.mapEdge.findMany()
        };
    }
    async createNode(data) { return this.prisma.mapNode.create({ data }); }
    async createEdge(data) { return this.prisma.mapEdge.create({ data }); }
};
exports.NavigationService = NavigationService;
exports.NavigationService = NavigationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NavigationService);
//# sourceMappingURL=navigation.service.js.map