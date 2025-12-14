import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get(':id')
  async getDoctor(@Param('id') id: number) {
    return this.doctorService.getDoctorById(Number(id));
  }

  @Put(':id')
  async updateDoctor(@Param('id') id: number, @Body() updateDto: UpdateDoctorDto) {
    return this.doctorService.updateDoctor(Number(id), updateDto);
  }
}
