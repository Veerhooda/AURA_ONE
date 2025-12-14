import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAppointment(@Body() body: {
    patientId: number;
    doctorId: number;
    dateTime: string;
    type: string;
    notes?: string;
  }) {
    return this.appointmentsService.createAppointment(
      body.patientId,
      body.doctorId,
      new Date(body.dateTime),
      body.type,
      body.notes,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('patient/:id')
  async getPatientAppointments(@Param('id', ParseIntPipe) patientId: number) {
    return this.appointmentsService.getPatientAppointments(patientId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('doctors')
  async getAllDoctors() {
    return this.appointmentsService.getAllDoctors();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('slots/:doctorId/:date')
  async getAvailableSlots(
    @Param('doctorId', ParseIntPipe) doctorId: number,
    @Param('date') date: string,
  ) {
    return this.appointmentsService.getAvailableSlots(doctorId, new Date(date));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    return this.appointmentsService.updateAppointmentStatus(id, body.status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async cancelAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.cancelAppointment(id);
  }
}
