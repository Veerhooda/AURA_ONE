import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'doctor@aura.com';
  const passwordRaw = 'doctor123';
  const hashedPassword = await bcrypt.hash(passwordRaw, 10);

  console.log('Creating dummy doctor user...');
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Dr. Dummy Account',
      role: 'DOCTOR',
    },
  });

  console.log(`✅ User created for doctor: ${user.email}`);

  // Create Doctor Profile linked to this User
  const doctor = await prisma.doctor.upsert({
    where: { email },
    update: { userId: user.id },
    create: {
      userId: user.id,
      name: 'Dr. Dummy Account',
      specialty: 'General Medicine',
      email: email,
    }
  });

  console.log(`✅ Doctor profile created and linked to user!`);
  console.log(`\n--- Login Credentials ---`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${passwordRaw}`);
  console.log(`Role: DOCTOR`);
  console.log(`-------------------------\n`);
}

main()
  .catch((e) => console.error('Error:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
