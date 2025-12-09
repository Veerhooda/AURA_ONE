import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async getDigitalTwin(id: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        vitals: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Calculated risk / AI simulation (Stub)
    // In a real app, this would call the AI Gateway
    const riskScore = patient.riskScore || 0;
    const aiPredictions = {
      hypotension_6h: riskScore > 50 ? 0.6 : 0.1,
      cardiac_event_24h: riskScore > 80 ? 0.4 : 0.05,
      deterioration_prob: riskScore / 100,
    };

    return {
      metadata: {
        name: patient.user.name,
        mrn: patient.mrn,
        bed: patient.bed,
        ward: patient.ward,
      },
      current_state: {
         heart_rate: this.getLatestVital(patient.vitals, 'HR'),
         blood_pressure: this.getLatestVital(patient.vitals, 'BP'),
         spo2: this.getLatestVital(patient.vitals, 'SPO2'),
         risk_score: riskScore,
      },
      risk_predictions: aiPredictions,
      trend_summary: [
        "Stable heart rate over last 4 hours",
        riskScore > 50 ? " elevated risk detected" : "No active alerts"
      ]
    };
  }

  private getLatestVital(vitals: any[], type: string) {
    const v = vitals.find(v => v.type === type);
    return v ? { value: v.value, unit: v.unit, time: v.timestamp } : null;
  }
  
  async createPatient(data: any) {
      return this.prisma.patient.create({ data });
  }

  async findAll() {
      return this.prisma.patient.findMany({ include: { user: true }});
  }
}
