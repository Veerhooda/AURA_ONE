"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding map data...');
    await prisma.mapEdge.deleteMany();
    await prisma.mapNode.deleteMany();
    console.log('Cleared old map data.');
    const nodes = [
        { id: 1, label: 'Main Entrance', x: 50, y: 95, type: 'EXIT' },
        { id: 2, label: 'Reception', x: 15, y: 80, type: 'ROOM' },
        { id: 3, label: 'Emergency', x: 15, y: 20, type: 'ROOM' },
        { id: 4, label: 'Cafeteria', x: 85, y: 80, type: 'ROOM' },
        { id: 5, label: 'General Ward', x: 50, y: 50, type: 'ROOM' },
        { id: 6, label: 'Surgery', x: 85, y: 20, type: 'ROOM' },
        { id: 7, label: 'ICU', x: 50, y: 15, type: 'ROOM' },
        { id: 8, label: 'Pharmacy', x: 85, y: 50, type: 'ROOM' },
        { id: 9, label: 'Triage', x: 15, y: 50, type: 'ROOM' },
        { id: 10, label: 'Corridor Top-Left', x: 25, y: 25, type: 'CORRIDOR' },
        { id: 11, label: 'Corridor Top-Right', x: 75, y: 25, type: 'CORRIDOR' },
        { id: 12, label: 'Corridor Bottom-Right', x: 75, y: 80, type: 'CORRIDOR' },
        { id: 13, label: 'Corridor Bottom-Left', x: 25, y: 80, type: 'CORRIDOR' },
        { id: 14, label: 'Corridor Top-Mid', x: 50, y: 25, type: 'CORRIDOR' },
        { id: 15, label: 'Corridor Bottom-Mid', x: 50, y: 80, type: 'CORRIDOR' },
        { id: 16, label: 'Corridor Left-Mid', x: 25, y: 50, type: 'CORRIDOR' },
        { id: 17, label: 'Corridor Right-Mid', x: 75, y: 50, type: 'CORRIDOR' },
    ];
    for (const n of nodes) {
        await prisma.mapNode.create({ data: n });
    }
    const links = [
        [10, 14, 25], [14, 11, 25],
        [11, 17, 25], [17, 12, 25],
        [12, 15, 25], [15, 13, 25],
        [13, 16, 25], [16, 10, 25],
        [1, 15, 15],
        [2, 13, 10],
        [3, 10, 10],
        [4, 12, 10],
        [6, 11, 10],
        [7, 14, 10],
        [5, 15, 30],
        [5, 15, 20],
        [9, 16, 10],
        [8, 17, 10],
    ];
    for (const [from, to, weight] of links) {
        try {
            await prisma.mapEdge.create({ data: { fromId: from, toId: to, weight } });
        }
        catch (e) { }
        try {
            await prisma.mapEdge.create({ data: { fromId: to, toId: from, weight } });
        }
        catch (e) { }
    }
    console.log('Hospital Map Seeded!');
}
main()
    .catch(e => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed_map.js.map