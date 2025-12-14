import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [DoctorService, PrismaService],
  controllers: [DoctorController],
})
export class DoctorModule {}
