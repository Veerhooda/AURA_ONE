import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('family')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('family')
export class FamilyController {
  constructor(private prisma: PrismaService) {}

  @Get('patients')
  @ApiOperation({ summary: 'Get list of patients monitored by the family member' })
  async getMyPatients(@Request() req) {
    const userId = req.user.userId;
    
    // Fetch relations
    const relations = await this.prisma.userPatientRelation.findMany({
      where: { userId },
      include: { 
        patient: {
          include: {
            user: true, // to get name
            vitals: { orderBy: { timestamp: 'desc' }, take: 1 },
            alerts: { where: { resolved: false } }
          }
        } 
      }
    });

    // Transform for UI
    return relations.map(r => ({
      relation: r.relation,
      patientId: r.patientId,
      name: r.patient.user.name,
      ward: r.patient.ward,
      lastVitals: r.patient.vitals[0] || null,
      activeAlerts: r.patient.alerts.length
    }));
  }
}
