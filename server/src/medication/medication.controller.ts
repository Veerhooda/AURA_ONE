import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('medication')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Get()
  @ApiOperation({ summary: 'List all available medications' })
  getAll() {
    return this.medicationService.getAllMedications();
  }

  @Get('patient/:id')
  @ApiOperation({ summary: 'Get active prescriptions for a patient' })
  getPrescriptions(@Param('id', ParseIntPipe) id: number) {
    return this.medicationService.getPatientPrescriptions(id);
  }

  @Post('prescribe/:patientId')
  @ApiOperation({ summary: 'Prescribe medication to patient (with interaction check)' })
  prescribe(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() body: { medicationId: number; dosage: string; frequency: string },
  ) {
    return this.medicationService.prescribe(
      patientId,
      body.medicationId,
      body.dosage,
      body.frequency,
    );
  }
}
