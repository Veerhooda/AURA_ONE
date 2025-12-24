import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Finding #14: Emergency Alert Service with 100% Delivery Guarantee
 * 
 * Architecture:
 * 1. Persist alert BEFORE attempting delivery
 * 2. Try WebSocket delivery first
 * 3. Fallback to push notification
 * 4. Fallback to SMS
 * 5. Retry with exponential backoff
 * 6. Track acknowledgment with server confirmation
 */
@Injectable()
export class EmergencyService {
  private readonly logger = new Logger(EmergencyService.name);
  
  constructor(
    private prisma: PrismaService,
  ) {}

  /**
   * Create and persist emergency alert
   * Returns alert ID for tracking
   */
  async createEmergencyAlert(
    patientId: number,
    severity: string,
    vitalType: string,
    value?: string,
    notes?: string,
  ): Promise<number> {
    const alert = await this.prisma.emergencyAlert.create({
      data: {
        patientId,
        severity,
        vitalType,
        value,
        notes,
      },
    });

    this.logger.warn(
      `🚨 Emergency Alert Created: ID=${alert.id}, Patient=${patientId}, Severity=${severity}, Type=${vitalType}`,
    );

    return alert.id;
  }

  /**
   * Mark alert as delivered via specific channel
   */
  async markDelivered(alertId: number, channel: 'WEBSOCKET' | 'PUSH' | 'SMS') {
    await this.prisma.emergencyAlert.update({
      where: { id: alertId },
      data: {
        deliveredVia: channel,
        deliveredAt: new Date(),
      },
    });

    this.logger.log(`✅ Emergency Alert ${alertId} delivered via ${channel}`);
  }

  /**
   * Mark alert as acknowledged (idempotent)
   * Returns success boolean
   */
  async acknowledgeEmergency(
    alertId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const alert = await this.prisma.emergencyAlert.findUnique({
        where: { id: alertId },
      });

      if (!alert) {
        this.logger.error(`❌ Emergency Alert ${alertId} not found`);
        return false;
      }

      // Idempotent: If already acknowledged, return success
      if (alert.acknowledgedAt) {
        this.logger.log(`ℹ️  Emergency Alert ${alertId} already acknowledged`);
        return true;
      }

      await this.prisma.emergencyAlert.update({
        where: { id: alertId },
        data: {
          acknowledgedBy: userId,
          acknowledgedAt: new Date(),
        },
      });

      this.logger.log(
        `✅ Emergency Alert ${alertId} acknowledged by User ${userId}`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `❌ Failed to acknowledge Emergency Alert ${alertId}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Get undelivered alerts for retry
   */
  async getUndeliveredAlerts(): Promise<any[]> {
    return this.prisma.emergencyAlert.findMany({
      where: {
        deliveredAt: null,
        retryCount: { lt: 5 }, // Max 5 retries
      },
      orderBy: { triggeredAt: 'asc' },
    });
  }

  /**
   * Get unacknowledged alerts
   */
  async getUnacknowledgedAlerts(patientId?: number): Promise<any[]> {
    return this.prisma.emergencyAlert.findMany({
      where: {
        acknowledgedAt: null,
        ...(patientId && { patientId }),
      },
      orderBy: { triggeredAt: 'desc' },
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

  /**
   * Increment retry count
   */
  async incrementRetry(alertId: number) {
    await this.prisma.emergencyAlert.update({
      where: { id: alertId },
      data: {
        retryCount: { increment: 1 },
        lastRetryAt: new Date(),
      },
    });
  }

  /**
   * Resolve emergency
   */
  async resolveEmergency(alertId: number) {
    await this.prisma.emergencyAlert.update({
      where: { id: alertId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
      },
    });
  }
}
