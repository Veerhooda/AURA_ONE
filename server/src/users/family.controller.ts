import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

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
      email: r.patient.user.email,
      ward: r.patient.ward,
      lastVitals: r.patient.vitals[0] || null,
      activeAlerts: r.patient.alerts.length,
      status: this._determineStatus(r.patient.vitals[0]),
      lastSeen: r.patient.vitals[0]?.timestamp || r.patient.updatedAt
    }));
  }

  @Post('create-patient')
  @ApiOperation({ summary: 'Create a new patient account and link to family' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'email', 'password', 'mrn', 'dob', 'gender', 'relationship'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        mrn: { type: 'string', description: 'Medical Record Number' },
        dob: { type: 'string', format: 'date' },
        gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
        weight: { type: 'string' },
        relationship: { type: 'string' }
      }
    }
  })
  async createFamilyPatient(@Request() req, @Body() body: {
    name: string;
    email: string;
    password: string;
    mrn: string;
    dob: string;
    gender: string;
    weight?: string;
    relationship: string;
  }) {
    const familyUserId = req.user.userId;

    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existing) {
      throw new HttpException('Email already registered', HttpStatus.CONFLICT);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user and patient in transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create patient with nested user
      const patient = await prisma.patient.create({
        data: {
          mrn: body.mrn,
          dob: new Date(body.dob),
          gender: body.gender,
          weight: body.weight,
          user: {
            create: {
              name: body.name,
              email: body.email,
              password: hashedPassword,
              role: 'PATIENT'
            }
          }
        },
        include: { user: true }
      });

      // Link to family
      await prisma.userPatientRelation.create({
        data: {
          userId: familyUserId,
          patientId: patient.id,
          relation: body.relationship
        }
      });

      return patient;
    });

    return {
      success: true,
      patientId: result.id,
      userId: result.user.id,
      message: 'Patient account created and linked successfully'
    };
  }

  @Post('add-patient')
  @ApiOperation({ summary: 'Add existing patient to your family monitoring list' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patientId: { type: 'number' },
        relationship: { type: 'string' }
      }
    }
  })
  async addExistingPatient(@Request() req, @Body() body: {
    patientId: number;
    relationship: string;
  }) {
    const userId = req.user.userId;

    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: body.patientId }
    });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    // Check if relation already exists
    const existing = await this.prisma.userPatientRelation.findFirst({
      where: {
        userId,
        patientId: body.patientId
      }
    });

    if (existing) {
      throw new HttpException('Patient already in your family list', HttpStatus.CONFLICT);
    }

    // Create relation
    await this.prisma.userPatientRelation.create({
      data: {
        userId,
        patientId: body.patientId,
        relation: body.relationship
      }
    });

    return {
      success: true,
      message: 'Patient added to family monitoring list'
    };
  }

  @Delete('remove/:patientId')
  @ApiOperation({ summary: 'Remove patient from family monitoring list' })
  async removePatient(@Request() req, @Param('patientId') patientId: string) {
    const userId = req.user.userId;
    const pId = parseInt(patientId);

    const relation = await this.prisma.userPatientRelation.findFirst({
      where: {
        userId,
        patientId: pId
      }
    });

    if (!relation) {
      throw new HttpException('Patient not in your monitoring list', HttpStatus.NOT_FOUND);
    }

    await this.prisma.userPatientRelation.delete({
      where: { id: relation.id }
    });

    return {
      success: true,
      message: 'Patient removed from monitoring list'
    };
  }

  private _determineStatus(vitals: any): string {
    if (!vitals) return 'Unknown';
    
    // Simple logic - can be enhanced
    const hr = vitals.hr || 0;
    const spo2 = vitals.spo2 || 0;

    if (hr < 60 || hr > 100 || spo2 < 95) {
      return 'Critical';
    } else if (hr < 70 || hr > 90 || spo2 < 97) {
      return 'Warning';
    }
    return 'Stable';
  }

  // ===== PATIENT-FACING ENDPOINT =====
  @Get('my-guardians/:patientId')
  @ApiOperation({ summary: 'Get family members watching this patient (for patient profile)' })
  async getMyGuardians(@Param('patientId') patientId: string) {
    const pId = parseInt(patientId);

    const relations = await this.prisma.userPatientRelation.findMany({
      where: { patientId: pId },
      include: {
        user: true, // The family member user
      },
    });

    return relations.map(r => ({
      id: r.id,
      name: r.user.name,
      email: r.user.email,
      relationship: r.relation,
    }));
  }
}

