
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
      blockchainId: '0x1234567890abcdef1234567890abcdef12345678', // Mock ID
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
