import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'patient@aura.com';
  const passwordRaw = 'password123';
  const hashedPassword = await bcrypt.hash(passwordRaw, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'John Doe',
      role: 'PATIENT',
    },
  });

  console.log(`User seeded: ${user.email} / ${passwordRaw}`);

  // Also Create Patient Profile
  const patient = await prisma.patient.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      mrn: 'MRN-1001',
      dob: new Date('1990-01-01'),
      gender: 'Male',
      diagnosis: 'Hypertension',
    }
  });

  console.log(`Patient profile created for: ${user.email}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
