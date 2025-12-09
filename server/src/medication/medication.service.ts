import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicationService {
  constructor(private prisma: PrismaService) {}

  async getAllMedications() {
    return this.prisma.medication.findMany();
  }

  async createMedication(data: any) {
    return this.prisma.medication.create({ data });
  }

  async getPatientPrescriptions(patientId: number) {
    return this.prisma.prescription.findMany({
      where: { patientId, active: true },
      include: { medication: true },
    });
  }

  async prescribe(patientId: number, medicationId: number, dosage: string, frequency: string) {
    // 1. Check for interactions with existing prescriptions
    const currentMeds = await this.prisma.prescription.findMany({
      where: { patientId, active: true },
      include: { medication: true },
    });

    const newMed = await this.prisma.medication.findUnique({ where: { id: medicationId } });
    if (!newMed) throw new NotFoundException('Medication not found');

    const warnings: string[] = [];
    
    // Simple Interaction Logic Stub
    // Real logic would parse JSON interactions or query external API
    for (const p of currentMeds) {
      if (p.medication.interactions && p.medication.interactions.includes(newMed.name)) {
        warnings.push(`Warning: ${newMed.name} may interact with ${p.medication.name}`);
      }
      // Reverse check fallback
      if (newMed.interactions && newMed.interactions.includes(p.medication.name)) {
        warnings.push(`Warning: ${newMed.name} may interact with ${p.medication.name}`);
      }
    }

    const prescription = await this.prisma.prescription.create({
      data: {
        patientId,
        medicationId,
        dosage,
        frequency,
        startDate: new Date(),
      },
    });

    return { prescription, warnings };
  }
}
