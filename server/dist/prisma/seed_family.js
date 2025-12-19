"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'family@aura.com';
    const passwordRaw = 'family123';
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            name: 'Sarah Smith',
            role: 'FAMILY',
        },
    });
    console.log(`✅ Family user created!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${passwordRaw}`);
    console.log(`   Role: FAMILY`);
    console.log(`\nYou can now login and access the Family Dashboard at /family/home`);
}
main()
    .catch((e) => console.error('Error:', e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed_family.js.map