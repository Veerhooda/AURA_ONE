"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const doctors = [
        {
            name: 'Dr. Sarah Smith',
            specialty: 'Cardiology',
            email: 'sarah.smith@aura.com',
        },
        {
            name: 'Dr. Michael Chen',
            specialty: 'Neurology',
            email: 'michael.chen@aura.com',
        },
        {
            name: 'Dr. Emily Johnson',
            specialty: 'Orthopedics',
            email: 'emily.johnson@aura.com',
        },
        {
            name: 'Dr. James Wilson',
            specialty: 'General Medicine',
            email: 'james.wilson@aura.com',
        },
        {
            name: 'Dr. Lisa Anderson',
            specialty: 'Pediatrics',
            email: 'lisa.anderson@aura.com',
        },
    ];
    for (const doctor of doctors) {
        await prisma.doctor.upsert({
            where: { email: doctor.email },
            update: {},
            create: doctor,
        });
    }
    console.log('✅ Seeded 5 doctors successfully!');
    const allDoctors = await prisma.doctor.findMany();
    console.log(`\nTotal doctors in database: ${allDoctors.length}`);
    allDoctors.forEach(doc => console.log(`  - ${doc.name} (${doc.specialty})`));
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed_doctors.js.map