import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Chat data...');

  // Find existing users
  const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } });
  const patient = await prisma.user.findFirst({ where: { role: 'PATIENT' } });

  if (!doctor || !patient) {
    console.log('⚠️  No doctor or patient found. Run seed_users first.');
    return;
  }

  const patientRecord = await prisma.patient.findFirst({ where: { userId: patient.id } });
  const doctorRecord = await prisma.doctor.findFirst({ where: { email: doctor.email } });

  if (!patientRecord || !doctorRecord) {
    console.log('⚠️  Patient or Doctor record not found.');
    return;
  }

  // Create or find conversation
  const conversation = await prisma.conversation.upsert({
    where: {
      patientId_doctorId: {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id
      }
    },
    update: {},
    create: {
      patientId: patientRecord.id,
      doctorId: doctorRecord.id,
    }
  });

  console.log(`✅ Conversation created: ${conversation.id}`);

  // Create messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: doctor.id,
        senderType: 'DOCTOR',
        content: 'Hello! How are you feeling today?',
        type: 'TEXT',
        sequence: 1,
      },
      {
        conversationId: conversation.id,
        senderId: patient.id,
        senderType: 'PATIENT',
        content: 'I am feeling better, thank you!',
        type: 'TEXT',
        sequence: 2,
      },
      {
        conversationId: conversation.id,
        senderId: doctor.id,
        senderType: 'DOCTOR',
        content: 'Great! Your vitals look stable.',
        type: 'TEXT',
        linkedVitalsId: 1,
        sequence: 3,
      }
    ]
  });

  console.log('✅ Chat messages seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
