"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding map data...');
    await prisma.mapEdge.deleteMany();
    await prisma.mapNode.deleteMany();
    console.log('Cleared old map data.');
    const entry = await prisma.mapNode.create({ data: { id: 1, label: 'Main Entrance', x: 50, y: 95, type: 'EXIT' } });
    const reception = await prisma.mapNode.create({ data: { id: 2, label: 'Reception', x: 50, y: 60, type: 'ROOM' } });
    const er = await prisma.mapNode.create({ data: { id: 3, label: 'Emergency', x: 15, y: 85, type: 'ROOM' } });
    const cafe = await prisma.mapNode.create({ data: { id: 4, label: 'Cafeteria', x: 85, y: 85, type: 'ROOM' } });
    const junction = await prisma.mapNode.create({ data: { id: 5, label: 'Main Junction', x: 50, y: 30, type: 'CORRIDOR' } });
    const surgery = await prisma.mapNode.create({ data: { id: 6, label: 'Surgery', x: 15, y: 15, type: 'ROOM' } });
    const pediatrics = await prisma.mapNode.create({ data: { id: 7, label: 'Pediatrics', x: 85, y: 15, type: 'ROOM' } });
    const elevator = await prisma.mapNode.create({ data: { id: 8, label: 'Elevator', x: 90, y: 50, type: 'ELEVATOR' } });
    const links = [
        [1, 2, 10],
        [2, 3, 15],
        [2, 4, 15],
        [2, 5, 10],
        [5, 6, 20],
        [5, 7, 20],
        [2, 8, 15],
    ];
    for (const [from, to, weight] of links) {
        await prisma.mapEdge.create({ data: { fromId: from, toId: to, weight } });
        await prisma.mapEdge.create({ data: { fromId: to, toId: from, weight } });
    }
    console.log('Hospital Map Seeded!');
}
main()
    .catch(e => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed_map.js.map