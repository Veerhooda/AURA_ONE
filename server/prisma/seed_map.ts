import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding map data...');

  // Create Nodes
  const node1 = await prisma.mapNode.create({ data: { id: 1, label: 'Entry', x: 0, y: 0, type: 'corridor' } });
  const node2 = await prisma.mapNode.create({ data: { id: 2, label: 'Corridor A', x: 0, y: 10, type: 'corridor' } });
  const node3 = await prisma.mapNode.create({ data: { id: 3, label: 'Reception', x: 5, y: 10, type: 'room' } });
  const node4 = await prisma.mapNode.create({ data: { id: 4, label: 'Elevator', x: 0, y: 20, type: 'elevator' } });
  const node5 = await prisma.mapNode.create({ data: { id: 5, label: 'Ward 1', x: -10, y: 20, type: 'ward' } });

  // Create Edges (Bidirectional)
  const edges = [
    { from: 1, to: 2, weight: 10 },
    { from: 2, to: 1, weight: 10 },
    { from: 2, to: 3, weight: 5 },
    { from: 3, to: 2, weight: 5 },
    { from: 2, to: 4, weight: 10 },
    { from: 4, to: 2, weight: 10 },
    { from: 4, to: 5, weight: 15 }, // Elevator to Ward
    { from: 5, to: 4, weight: 15 },
  ];

  for (const edge of edges) {
    await prisma.mapEdge.create({
      data: {
        fromId: edge.from,
        toId: edge.to,
        weight: edge.weight,
      }
    });
  }

  console.log('Map seeded!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
