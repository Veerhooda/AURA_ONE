import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(
    patientId: number,
    doctorId: number,
    dateTime: Date,
    type: string,
    notes?: string,
  ) {
    return this.prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime,
        type,
        notes,
      },
      include: {
        doctor: true,
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getPatientAppointments(patientId: number) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: true,
      },
      orderBy: {
        dateTime: 'asc',
      },
    });
  }

  async getAllDoctors() {
    return this.prisma.doctor.findMany();
  }

  async updateAppointmentStatus(id: number, status: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  async cancelAppointment(id: number) {
    return this.updateAppointmentStatus(id, 'cancelled');
  }

  // Mock doctor availability - returns available time slots for a given date
  getAvailableSlots(doctorId: number, date: Date) {
    // Mock: Return slots from 9 AM to 5 PM, every hour
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      slots.push(slotTime.toISOString());
    }
    return slots;
  }
}
