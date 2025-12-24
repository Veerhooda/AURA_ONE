import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * C10: Audit Service for HIPAA Compliance
 * Logs all clinical actions with immutable records
 */
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log a clinical action to the audit trail
   * @param userId - User performing the action
   * @param userRole - Role of the user (DOCTOR, NURSE, etc.)
   * @param action - Action type (PRESCRIBE_MED, DISCHARGE_PATIENT, etc.)
   * @param entityType - Type of entity affected (MEDICATION, PATIENT, etc.)
   * @param entityId - ID of the affected entity
   * @param changes - Object containing before/after values
   * @param ipAddress - Optional IP address of the request
   */
  async log(
    userId: number,
    userRole: string,
    action: string,
    entityType: string,
    entityId: number | null,
    changes: any,
    ipAddress?: string,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          userRole,
          action,
          entityType,
          entityId,
          changes,
          ipAddress,
        },
      });
    } catch (error) {
      // Critical: Audit logging failure should be escalated
      console.error('🚨 CRITICAL: Audit log write failed:', error);
      // In production, this should trigger an alert
      throw new Error('Audit logging failed - operation aborted for compliance');
    }
  }

  /**
   * Query audit logs for a specific entity
   */
  async getEntityAuditTrail(entityType: string, entityId: number) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Query audit logs for a specific user
   */
  async getUserAuditTrail(userId: number, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  /**
   * Query audit logs by action type
   */
  async getActionAuditTrail(action: string, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: { action },
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
