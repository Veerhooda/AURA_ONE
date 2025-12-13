import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding map data...');
  
  // Clean up existing data
  await prisma.mapEdge.deleteMany();
  await prisma.mapNode.deleteMany();
  console.log('Cleared old map data.');

  // Coordinates on 0-100 scale matching generated hospital_map.png
  // Layout Assumption:
  // - Entrance: Bottom Center
  // - Central Block: General Ward
  // - Surroundings: Corridor Loop around the center
  // - Rooms: Attached to the outside of the loop

  const nodes = [
    // --- ROOMS ---
    { id: 1, label: 'Main Entrance', x: 50, y: 95, type: 'EXIT' },      // Bottom Center
    { id: 2, label: 'Reception', x: 15, y: 80, type: 'ROOM' },          // Bottom Left
    { id: 3, label: 'Emergency', x: 15, y: 20, type: 'ROOM' },          // Top Left
    { id: 4, label: 'Cafeteria', x: 85, y: 80, type: 'ROOM' },          // Bottom Right
    { id: 5, label: 'General Ward', x: 50, y: 50, type: 'ROOM' },       // Center
    { id: 6, label: 'Surgery', x: 85, y: 20, type: 'ROOM' },            // Top Right
    { id: 7, label: 'ICU', x: 50, y: 15, type: 'ROOM' },                // Top Center
    { id: 8, label: 'Pharmacy', x: 85, y: 50, type: 'ROOM' },           // Right Center
    { id: 9, label: 'Triage', x: 15, y: 50, type: 'ROOM' },             // Left Center

    // --- CORRIDOR LOOP (The "Highway") ---
    // A rectangle around the center: Left X=25, Right X=75, Top Y=25, Bottom Y=80
    { id: 10, label: 'Corridor Top-Left', x: 25, y: 25, type: 'CORRIDOR' },
    { id: 11, label: 'Corridor Top-Right', x: 75, y: 25, type: 'CORRIDOR' },
    { id: 12, label: 'Corridor Bottom-Right', x: 75, y: 80, type: 'CORRIDOR' },
    { id: 13, label: 'Corridor Bottom-Left', x: 25, y: 80, type: 'CORRIDOR' },
    
    // --- CORRIDOR ACCESS POINTS (Midpoints) ---
    { id: 14, label: 'Corridor Top-Mid', x: 50, y: 25, type: 'CORRIDOR' },
    { id: 15, label: 'Corridor Bottom-Mid', x: 50, y: 80, type: 'CORRIDOR' },
    { id: 16, label: 'Corridor Left-Mid', x: 25, y: 50, type: 'CORRIDOR' },
    { id: 17, label: 'Corridor Right-Mid', x: 75, y: 50, type: 'CORRIDOR' },
  ];

  for (const n of nodes) {
    await prisma.mapNode.create({ data: n });
  }

  // Edges (Bidirectional)
  const links = [
    // 1. Build the Main Loop (Rectangle)
    [10, 14, 25], [14, 11, 25], // Top Edge
    [11, 17, 25], [17, 12, 25], // Right Edge
    [12, 15, 25], [15, 13, 25], // Bottom Edge
    [13, 16, 25], [16, 10, 25], // Left Edge

    // 2. Connect Rooms to the Loop
    [1, 15, 15],  // Entrance -> Bottom-Mid
    [2, 13, 10],  // Reception -> Bottom-Left Corner
    [3, 10, 10],  // Emergency -> Top-Left Corner
    [4, 12, 10],  // Cafeteria -> Bottom-Right Corner
    [6, 11, 10],  // Surgery -> Top-Right Corner
    
    [7, 14, 10],  // ICU -> Top-Mid
    [5, 15, 30],  // General Ward -> Bottom-Mid (Enter from bottom??) OR 
                  // Let's connect Ward to multiple sides for easier access? 
                  // Let's say Ward entrance is at the bottom:
    [5, 15, 20],  // Ward -> Bottom-Mid corridor
    
    [9, 16, 10],  // Triage -> Left-Mid
    [8, 17, 10],  // Pharmacy -> Right-Mid
  ];

  for (const [from, to, weight] of links) {
    try {
      await prisma.mapEdge.create({ data: { fromId: from, toId: to, weight } });
    } catch(e) {}
    try {
      await prisma.mapEdge.create({ data: { fromId: to, toId: from, weight } });
    } catch(e) {}
  }

  console.log('Hospital Map Seeded!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
