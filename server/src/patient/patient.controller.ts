import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
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
  @Get(':id/recovery-graph')
  getRecoveryGraph(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.generateRecoveryGraph(id);
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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/pain')
  reportPain(@Param('id', ParseIntPipe) id: number, @Body('level') level: number) {
      return this.patientService.reportPain(id, level);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  updateProfile(@Request() req, @Body() data: any) {
      return this.patientService.updateProfileByUserId(req.user.userId, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }) {
    return this.patientService.updateStatus(id, body.status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/medications')
  addMedication(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.patientService.addMedication(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/history')
  addHistory(@Param('id', ParseIntPipe) id: number, @Body('note') note: string) {
    return this.patientService.addHistory(id, note);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/medications')
  getPatientMedications(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.getPatientMedications(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/history')
  getPatientHistory(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.getPatientHistory(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/reports')
  getPatientReports(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.getPatientReports(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/reports')
  async uploadReport(@Param('id', ParseIntPipe) id: number, @Body() body: { fileName: string; fileType: string }) {
    return this.patientService.uploadReport(id, body.fileName, body.fileType);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/vitals/manual')
  async addManualVital(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { type: string; value: number; unit: string },
  ) {
    return this.patientService.addManualVital(id, body.type, body.value, body.unit);
  }
}
