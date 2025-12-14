import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Doctor } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getDoctorById(id: number): Promise<Doctor> {
    return this.prisma.doctor.findUnique({
      where: { id },
    });
  }

  async updateDoctor(id: number, data: { name?: string; specialty?: string; email?: string }): Promise<Doctor> {
    return this.prisma.doctor.update({
      where: { id },
      data,
    });
  }
}
