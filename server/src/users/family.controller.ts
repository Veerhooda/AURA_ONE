import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, HttpException, HttpStatus, ValidationPipe, UsePipes } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { IsString, IsEmail, MinLength, IsEnum, IsOptional, IsDateString, IsInt } from 'class-validator';

// --- DTOs ---

export class CreateFamilyPatientDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @MinLength(5)
  mrn: string;

  @IsDateString()
  dob: string;

  @IsString()
  @IsEnum(['Male', 'Female', 'Other'])
  gender: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsString()
  @MinLength(2)
  relationship: string;
}

export class AddExistingPatientDto {
  @IsInt()
  patientId: number;

  @IsString()
  @MinLength(2)
  relationship: string;
}

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
    
    const relations = await this.prisma.userPatientRelation.findMany({
      where: { userId },
      include: { 
        patient: {
          include: {
            user: true,
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
      lastVitals: r.patient.latestVitals || null,
      activeAlerts: 0, // TODO: Count from emergencyAlerts
      status: this._determineStatus(r.patient.latestVitals),
      lastSeen: r.patient.updatedAt
    }));
  }

  @Post('create-patient')
  @ApiOperation({ summary: 'Create a new patient account and link to family' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createFamilyPatient(@Request() req, @Body() body: CreateFamilyPatientDto) {
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

    try {
      // Create user and patient in transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create patient with nested user
        // Note: MRN collision could happen here, handled by catch block
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

    } catch (e) {
      if (e.code === 'P2002') {
        // Unique constraint violation
        const target = e.meta?.target;
        if (Array.isArray(target) && target.includes('mrn')) {
          throw new HttpException('MRN collision detected. Please try again.', HttpStatus.CONFLICT);
        }
        if (Array.isArray(target) && target.includes('email')) {
           throw new HttpException('Email already registered', HttpStatus.CONFLICT);
        }
      }
      throw e;
    }
  }

  @Post('add-patient')
  @ApiOperation({ summary: 'Add existing patient to your family monitoring list' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addExistingPatient(@Request() req, @Body() body: AddExistingPatientDto) {
    const userId = req.user.userId;

    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: body.patientId }
    });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    try {
      // Create relation
      // We rely on the DB unique constraint @@unique([userId, patientId])
      // instead of checking first, to enable atomic concurrency safety
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

    } catch (e) {
      if (e.code === 'P2002') {
        throw new HttpException('Patient already in your family list', HttpStatus.CONFLICT);
      }
      throw e;
    }
  }

  @Delete('remove/:patientId')
  @ApiOperation({ summary: 'Remove patient from family monitoring list' })
  async removePatient(@Request() req, @Param('patientId') patientId: string) {
    const userId = req.user.userId;
    const pId = parseInt(patientId);
    
    if (isNaN(pId)) {
        throw new HttpException('Invalid patient ID', HttpStatus.BAD_REQUEST);
    }

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

    if (isNaN(pId)) {
      throw new HttpException('Invalid patient ID', HttpStatus.BAD_REQUEST);
    }

    const relations = await this.prisma.userPatientRelation.findMany({
      where: { patientId: pId },
      select: {
        id: true,
        relation: true,
        user: {
          select: {
            name: true,
            // Minimal info exposed - NO EMAIL, NO PASSWORD
          }
        }
      }
    });

    return relations.map(r => ({
      id: r.id,
      name: r.user.name,
      relationship: r.relation,
    }));
  }
}


