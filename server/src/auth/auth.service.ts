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

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      patient: patient, // Return full patient details (MRN, id, etc.)
      isProfileComplete,
    };
  }

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
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

    // If role is PATIENT, create Patient record
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
         } as any, // Cast to any to bypass stale type definition
       });
    }
    
    return newUser;
  }
}
