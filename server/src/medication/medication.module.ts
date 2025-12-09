import { Module } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { MedicationController } from './medication.controller';

@Module({
  controllers: [MedicationController],
  providers: [MedicationService],
})
export class MedicationModule {}
