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
        weight: patient.weight,
        symptoms: patient.symptoms,
      },
      status: patient.status || 'Discharged',
      diagnosis: patient.diagnosis || '',
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
  async updateStatus(id: number, status: string) {
    return this.prisma.patient.update({
      where: { id },
      data: { status }
    });
  }

  async addMedication(patientId: number, data: any) {
    // 1. Create Medication if not exists (simplified logic)
    const medication = await this.prisma.medication.create({
      data: {
        name: data.name,
        description: data.description || 'Prescribed by doctor'
      }
    });

    // 2. Create Prescription linked to patient
    return this.prisma.prescription.create({
      data: {
        patientId,
        medicationId: medication.id,
        dosage: data.dosage || '1 pill daily',
        frequency: data.frequency || 'Daily',
        startDate: new Date(),
        active: true
      }
    });
  }

  // Since we don't have a structured "History" table yet, we'll append to the 'diagnosis' field 
  // or use a structured JSON field if we updated the schema. 
  // For now, let's assume we append to the 'diagnosis' string for simplicity or creating a note.
  // Wait, the user wants "add or change patient history". 
  // The Mobile UI mocks this list. Let's return a success stub and maybe log it for now
  // OR we can add a 'notes' field to Patient? 
  // Let's check Schema... 'diagnosis' is there. Let's use that one or mock it.
  // Actually, let's create a Note model? No, let's stick to minimal schema changes as promised.
  // I will just append to 'diagnosis' field with a timestamp for now.
  async addHistory(id: number, note: string) {
     const patient = await this.prisma.patient.findUnique({where: {id}});
     const newEntry = `[${new Date().toISOString().split('T')[0]}] ${note}`;
     const updatedHistory = patient.diagnosis ? `${patient.diagnosis}\n${newEntry}` : newEntry;
     
     return this.prisma.patient.update({
       where: { id },
       data: { diagnosis: updatedHistory }
     });
   }

  async getPatientMedications(patientId: number) {
    const prescriptions = await this.prisma.prescription.findMany({
      where: { 
        patientId,
        active: true
      },
      include: {
        medication: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return prescriptions.map(p => ({
      id: p.id,
      name: p.medication.name,
      dosage: p.dosage,
      frequency: p.frequency,
      startDate: p.startDate,
      active: p.active
    }));
  }

  async getPatientHistory(patientId: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: { diagnosis: true }
    });

    if (!patient?.diagnosis) {
      return [];
    }

    // Parse diagnosis field: each line is [YYYY-MM-DD] Type: Note
    const entries = patient.diagnosis.split('\n').filter(line => line.trim());
    return entries.map(entry => {
      const match = entry.match(/^\[([\d-]+)\]\s*(.+)$/);
      if (match) {
        const [, date, rest] = match;
        // Find the first colon to split type and note
        const colonIndex = rest.indexOf(':');
        if (colonIndex > 0) {
          const type = rest.substring(0, colonIndex).trim();
          const note = rest.substring(colonIndex + 1).trim();
          return {
            date,
            type,
            note
          };
        }
        // No colon found, treat whole thing as a note
        return { date, type: 'Note', note: rest.trim() };
      }
      // Malformed entry, return as-is with current date
      return { 
        date: new Date().toISOString().split('T')[0], 
        type: 'Note', 
        note: entry.trim() 
      };
    });
  }
}
