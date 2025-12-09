import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PatientService } from './patient.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/twin')
  getDigitalTwin(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.getDigitalTwin(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
      return this.patientService.findAll();
  }

  // Admin or internal use to create patient records linked to users
  @Post()
  create(@Body() createPatientDto: any) {
      return this.patientService.createPatient(createPatientDto);
  }
}
