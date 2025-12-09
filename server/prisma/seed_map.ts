import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding map data...');
  
  // Clean up existing data
  await prisma.mapEdge.deleteMany();
  await prisma.mapNode.deleteMany();
  console.log('Cleared old map data.');

  // Normalize coordinates to 0-100 scale (Top-Left 0,0)
  // Image Assumption: Entrance Bottom, Reception Center, Wards Top Corners.
  
  // 1. Entrance (Bottom Center)
  const entry = await prisma.mapNode.create({ data: { id: 1, label: 'Main Entrance', x: 50, y: 95, type: 'EXIT' } });
  
  // 2. Reception (Center)
  const reception = await prisma.mapNode.create({ data: { id: 2, label: 'Reception', x: 50, y: 60, type: 'ROOM' } });
  
  // 3. Emergency (Bottom Left)
  const er = await prisma.mapNode.create({ data: { id: 3, label: 'Emergency', x: 15, y: 85, type: 'ROOM' } });
  
  // 4. Cafeteria (Bottom Right)
  const cafe = await prisma.mapNode.create({ data: { id: 4, label: 'Cafeteria', x: 85, y: 85, type: 'ROOM' } });
  
  // 5. Corridor Junction (Mid Top)
  const junction = await prisma.mapNode.create({ data: { id: 5, label: 'Main Junction', x: 50, y: 30, type: 'CORRIDOR' } });
  
  // 6. Surgery Ward (Top Left)
  const surgery = await prisma.mapNode.create({ data: { id: 6, label: 'Surgery', x: 15, y: 15, type: 'ROOM' } });
  
  // 7. Pediatric Ward (Top Right)
  const pediatrics = await prisma.mapNode.create({ data: { id: 7, label: 'Pediatrics', x: 85, y: 15, type: 'ROOM' } });
  
  // 8. Elevator (Mid Right)
  const elevator = await prisma.mapNode.create({ data: { id: 8, label: 'Elevator', x: 90, y: 50, type: 'ELEVATOR' } });

  // Edges (Bidirectional)
  const links = [
    [1, 2, 10], // Entry -> Reception
    [2, 3, 15], // Reception -> ER
    [2, 4, 15], // Reception -> Cafe
    [2, 5, 10], // Reception -> Junction
    [5, 6, 20], // Junction -> Surgery
    [5, 7, 20], // Junction -> Pediatrics
    [2, 8, 15], // Reception -> Elevator
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
