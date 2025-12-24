import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Production Blocker #1: Emergency Queue Service
 * Handles multiple simultaneous emergencies without UI blocking
 */
@Injectable()
export class EmergencyQueueService {
  private readonly logger = new Logger(EmergencyQueueService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get active emergency queue for a user
   * Ordered by: severity (CRITICAL > HIGH > MEDIUM > LOW), then time
   */
  async getActiveQueue(userId: number): Promise<any[]> {
    const alerts = await this.prisma.emergencyAlert.findMany({
      where: {
        acknowledgedAt: null,
        resolved: false,
      },
      include: {
        patient: {
          select: {
            id: true,
            mrn: true,
            user: { select: { name: true } },
          },
        },
      },
      orderBy: [
        // Priority ordering
        {
          severity: 'desc', // CRITICAL first
        },
        {
          triggeredAt: 'asc', // Oldest first within same severity
        },
      ],
    });

    // Map severity to numeric priority for sorting
    const severityPriority = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

    return alerts.sort((a, b) => {
      const aPriority = severityPriority[a.severity] || 0;
      const bPriority = severityPriority[b.severity] || 0;

      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }

      // Same priority, sort by time
      return a.triggeredAt.getTime() - b.triggeredAt.getTime();
    });
  }

  /**
   * Get next emergency in queue (highest priority, oldest)
   */
  async getNextEmergency(): Promise<any | null> {
    const queue = await this.getActiveQueue(0); // userId not used for filtering
    return queue.length > 0 ? queue[0] : null;
  }

  /**
   * Get queue count for badge display
   */
  async getQueueCount(): Promise<number> {
    return this.prisma.emergencyAlert.count({
      where: {
        acknowledgedAt: null,
        resolved: false,
      },
    });
  }

  /**
   * Acknowledge and move to next in queue
   * Returns next emergency or null
   */
  async acknowledgeAndNext(
    alertId: number,
    userId: number,
  ): Promise<any | null> {
    // Acknowledge current
    await this.prisma.emergencyAlert.update({
      where: { id: alertId },
      data: {
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
      },
    });

    this.logger.log(
      `✅ Emergency ${alertId} acknowledged, fetching next in queue`,
    );

    // Get next
    return this.getNextEmergency();
  }
}
