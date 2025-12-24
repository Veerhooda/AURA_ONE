import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService, // Inject PrismaService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    // Check if patient profile is complete
    let isProfileComplete = true;
    let patient = null;
    if (user.role === 'PATIENT') {
      patient = await this.prisma.patient.findFirst({ where: { userId: user.id } });
      // Consider profile incomplete if no patient record OR weight is missing
      if (!patient || !(patient as any).weight) {
        isProfileComplete = false;
      }
    }

    // Add doctorId to payload for DOCTOR role (C17 fix)
    let doctorId = null;
    if (user.role === 'DOCTOR') {
      // Doctor model uses email, not userId relation yet
      const doctor = await this.prisma.doctor.findFirst({ 
        where: { email: user.email } 
      });
      if (doctor) {
        doctorId = doctor.id;
        payload['doctorId'] = doctorId;
      }
    }

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '8h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      patient: patient,
      doctorId: doctorId, // Include for DOCTOR role
      isProfileComplete,
    };
  }

  /**
   * Finding #2: Refresh Access Token
   * Validates refresh token and issues new access token
   */
  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Generate new access token with same payload
      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
          ...(payload.doctorId && { doctorId: payload.doctorId }),
        },
        { expiresIn: '8h' },
      );

      return {
        access_token: newAccessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async register(data: any) {
    // Use 12 rounds for stronger password hashing (C11 fix)
    const BCRYPT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    
    // Generate Fake Blockchain ID (SHA-256 of email + timestamp)
    const { createHash } = await import('crypto');
    const blockchainId = createHash('sha256').update(data.email + Date.now().toString()).digest('hex');



    // Create User (Only pass User fields)
    let newUser;
    try {
      newUser = await this.usersService.createUser({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        blockchainId: blockchainId,
      } as any); // Cast to any to bypass stale type definition
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email or Blockchain ID already exists');
      }
      throw error;
    }

    // Role-specific Profile Creation
    if (data.role === 'PATIENT') {
       await this.prisma.patient.create({
         data: {
           userId: newUser.id,
           mrn: `MRN-${Date.now().toString().substring(6)}`, 
           dob: new Date('1990-01-01'), 
           gender: 'Unknown', 
           weight: data.weight || '70 kg',
           status: data.status || 'Admitted',
           symptoms: data.symptoms || 'None recorded',
           bed: 'Unassigned',
           ward: 'General',
         } as any, 
       });
    } else if (data.role === 'DOCTOR') {
      try {
        await this.prisma.doctor.upsert({
          where: { email: data.email },
          update: {
            userId: newUser.id, // Link existing doctor record to this user
            name: data.name,
          },
          create: {
            userId: newUser.id,
            name: data.name,
            email: data.email,
            specialty: data.specialty || 'General Practice',
          },
        });
      } catch (e) {
        console.warn('Doctor profile creation warning:', e);
        // Continue, as User is created. Profile can be fixed later.
      }
    } else if (data.role === 'NURSE') {
       // No specific Nurse profile model yet.
       // Future: Create Nurse profile with ward info.
    }
    
    return newUser;
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    let profile: any = { ...result };

    if (user.role === 'PATIENT') {
      const patient = await this.prisma.patient.findFirst({
        where: { userId: user.id },
      });
      profile.patient = patient;
      profile.patientId = patient?.id;
    } else if (user.role === 'DOCTOR') {
      // Find doctor by userId relation OR by email fallback
      let doctor = await this.prisma.doctor.findFirst({
        where: { userId: user.id },
      });

      if (!doctor) {
        doctor = await this.prisma.doctor.findFirst({
          where: { email: user.email },
        });
      }

      profile.doctor = doctor;
      profile.doctorId = doctor?.id;
    }

    return profile;
  }
}
