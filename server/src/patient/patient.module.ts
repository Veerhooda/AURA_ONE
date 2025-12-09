import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

@Module({
  providers: [PatientService],
  controllers: [PatientController]
})
export class PatientModule {}
