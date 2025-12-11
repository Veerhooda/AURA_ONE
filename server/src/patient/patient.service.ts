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

    // Use latestVitals snapshot if available, otherwise fall back to Vitals table
    const lv = patient.latestVitals as any;

    return {
      metadata: {
        name: patient.user.name,
        mrn: patient.mrn,
        bed: patient.bed,
        ward: patient.ward,
      },
      current_state: {
         heart_rate: lv?.hr ?? this.getLatestVital(patient.vitals, 'HR')?.value,
         blood_pressure: lv?.bp ?? this.getLatestVital(patient.vitals, 'BP')?.value,
         spo2: lv?.spo2 ?? this.getLatestVital(patient.vitals, 'SPO2')?.value,
         risk_score: riskScore,
         pain_level: patient.painLevel,
         pain_reported_at: patient.painReportedAt,
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

  async reportPain(patientId: number, level: number) {
      return this.prisma.patient.update({
          where: { id: patientId },
          data: { 
              painLevel: level,
              painReportedAt: new Date()
          }
      });
  }

  async updateProfileByUserId(userId: number, data: any) {
    // Check if patient exists
    const existing = await this.prisma.patient.findFirst({ where: { userId } });
    
    if (existing) {
      return this.prisma.patient.update({
        where: { id: existing.id },
        data: {
          weight: data.weight,
          status: data.status,
          symptoms: data.symptoms,
          mrn: existing.mrn || `MRN-${Date.now()}` // Ensure MRN exists
        }
      });
    } else {
      // Create if missing (backfill)
      return this.prisma.patient.create({
        data: {
          userId,
          mrn: `MRN-${Date.now().toString().substring(6)}`,
          dob: new Date('1990-01-01'),
          gender: 'Unknown',
          weight: data.weight || '70 kg',
          status: data.status || 'Admitted',
          symptoms: data.symptoms || 'None recorded',
          bed: 'Unassigned',
          ward: 'General',
        }
      });
    }
  }
}
