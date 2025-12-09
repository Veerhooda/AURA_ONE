import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MapNode, MapEdge } from '@prisma/client';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}

  async findPath(fromId: number, toId: number) {
    // 1. Fetch all nodes and edges (In a real large app, we would cache this or load partial graph)
    const nodes = await this.prisma.mapNode.findMany();
    const edges = await this.prisma.mapEdge.findMany({ where: { isAccessible: true } });

    if (!nodes.find(n => n.id === fromId) || !nodes.find(n => n.id === toId)) {
        throw new NotFoundException('Start or End node not found');
    }

    // 2. Build Adjacency List
    const graph = new Map<number, { to: number; weight: number }[]>();
    nodes.forEach(n => graph.set(n.id, []));
    for (const e of edges) {
        if (!graph.has(e.fromId)) graph.set(e.fromId, []);
        if (!graph.has(e.toId)) graph.set(e.toId, []);
        
        graph.get(e.fromId)?.push({ to: e.toId, weight: e.weight });
        // Assuming undirected for walking, or specific logic if directed
        graph.get(e.toId)?.push({ to: e.fromId, weight: e.weight });
    }

    // 3. Dijkstra's Algorithm
    const distances = new Map<number, number>();
    const previous = new Map<number, number>();
    const pq = new Set<number>(); // Simple priority queue simulation

    nodes.forEach(n => {
        distances.set(n.id, Infinity);
        pq.add(n.id);
    });
    distances.set(fromId, 0);

    while (pq.size > 0) {
        // failed optimization: simplistic min extraction
        let minNode = null;
        for (const nodeId of pq) {
            if (minNode === null || distances.get(nodeId) < distances.get(minNode)) {
                minNode = nodeId;
            }
        }
        
        if (minNode === null || distances.get(minNode) === Infinity) break;
        if (minNode === toId) break;

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

    // 4. Reconstruct Path
    const path: number[] = [];
    let current = toId;
    if (previous.has(current) || current === fromId) {
        while (current !== undefined) {
            path.unshift(current);
            current = previous.get(current);
        }
    }

    if (path.length === 0 || path[0] !== fromId) {
        throw new BadRequestException('No path found between these locations');
    }

    // 5. Hydrate Path Nodes
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

  // Admin helper
  async createNode(data: any) { return this.prisma.mapNode.create({ data }); }
  async createEdge(data: any) { return this.prisma.mapEdge.create({ data }); }
}
