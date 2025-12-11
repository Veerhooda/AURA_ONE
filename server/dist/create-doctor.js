"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'doctor@aura.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Dr. Sarah Smith',
            password: hashedPassword,
            role: 'DOCTOR',
            blockchainId: '0x1234567890abcdef1234567890abcdef12345678',
        },
    });
    console.log({ doctor });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=create-doctor.js.map