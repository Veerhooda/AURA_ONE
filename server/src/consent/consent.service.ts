import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * C14: Consent Management Service for HIPAA Compliance
 * Manages patient consent for data access by family members
 */
@Injectable()
export class ConsentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if a user has consent to access patient data
   */
  async hasConsent(
    guardianId: number,
    patientId: number,
    consentType: string,
  ): Promise<boolean> {
    const consent = await this.prisma.patientConsent.findFirst({
      where: {
        guardianId,
        patientId,
        consentType,
        revokedAt: null, // Only active consents
      },
    });

    return !!consent;
  }

  /**
   * Grant consent to a guardian
   */
  async grantConsent(
    patientId: number,
    guardianId: number,
    consentType: string,
    grantedBy: number,
  ) {
    // Check if consent already exists
    const existing = await this.prisma.patientConsent.findFirst({
      where: {
        patientId,
        guardianId,
        consentType,
        revokedAt: null,
      },
    });

    if (existing) {
      return existing; // Already granted
    }

    return this.prisma.patientConsent.create({
      data: {
        patientId,
        guardianId,
        consentType,
        grantedBy,
      },
    });
  }

  /**
   * Revoke consent
   */
  async revokeConsent(
    patientId: number,
    guardianId: number,
    consentType: string,
  ) {
    const consent = await this.prisma.patientConsent.findFirst({
      where: {
        patientId,
        guardianId,
        consentType,
        revokedAt: null,
      },
    });

    if (!consent) {
      throw new Error('Consent not found');
    }

    return this.prisma.patientConsent.update({
      where: { id: consent.id },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Get all consents for a patient
   */
  async getPatientConsents(patientId: number) {
    return this.prisma.patientConsent.findMany({
      where: { patientId, revokedAt: null },
      include: {
        guardian: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Get all consents granted to a guardian
   */
  async getGuardianConsents(guardianId: number) {
    return this.prisma.patientConsent.findMany({
      where: { guardianId, revokedAt: null },
      include: {
        patient: {
          select: {
            id: true,
            mrn: true,
            user: { select: { name: true } },
          },
        },
      },
    });
  }
}
