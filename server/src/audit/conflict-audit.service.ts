import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Production Blocker #3: Conflict Resolution Audit Service
 * Logs all conflict detections and resolutions for legal compliance
 */
@Injectable()
export class ConflictAuditService {
  private readonly logger = new Logger(ConflictAuditService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Log conflict detection (immutable)
   * Called when 409 is thrown
   */
  async logConflictDetection(
    userId: number,
    userRole: string,
    entityType: string,
    entityId: number,
    expectedVersion: number,
    currentVersion: number,
    conflictFields: string[],
    yourData: any,
    serverData: any,
    ipAddress?: string,
  ): Promise<number> {
    const log = await this.prisma.conflictResolutionLog.create({
      data: {
        userId,
        userRole,
        entityType,
        entityId,
        expectedVersion,
        currentVersion,
        conflictFields,
        yourData,
        serverData,
        resolvedData: {}, // Will be updated on resolution
        detectedAt: new Date(),
        resolvedAt: new Date(), // Placeholder, updated on resolution
        ipAddress,
      },
    });

    this.logger.warn(
      `⚠️  CONFLICT DETECTED: User ${userId} (${userRole}) on ${entityType} ${entityId}. Expected v${expectedVersion}, Current v${currentVersion}. Fields: ${conflictFields.join(', ')}`,
    );

    return log.id;
  }

  /**
   * Log conflict resolution (immutable)
   * Called when user resolves conflict
   */
  async logConflictResolution(
    conflictLogId: number,
    resolvedData: any,
  ): Promise<void> {
    await this.prisma.conflictResolutionLog.update({
      where: { id: conflictLogId },
      data: {
        resolvedData,
        resolvedAt: new Date(),
      },
    });

    this.logger.log(
      `✅ CONFLICT RESOLVED: Log ${conflictLogId}. Resolution saved.`,
    );
  }

  /**
   * Get conflict history for entity
   */
  async getConflictHistory(
    entityType: string,
    entityId: number,
  ): Promise<any[]> {
    return this.prisma.conflictResolutionLog.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { detectedAt: 'desc' },
    });
  }

  /**
   * Get conflict statistics for compliance reporting
   */
  async getConflictStats(startDate: Date, endDate: Date): Promise<any> {
    const conflicts = await this.prisma.conflictResolutionLog.findMany({
      where: {
        detectedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      total: conflicts.length,
      byEntityType: this.groupBy(conflicts, 'entityType'),
      byUser: this.groupBy(conflicts, 'userId'),
      avgResolutionTime: this.calculateAvgResolutionTime(conflicts),
    };
  }

  private groupBy(array: any[], key: string): any {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  private calculateAvgResolutionTime(conflicts: any[]): number {
    if (conflicts.length === 0) return 0;

    const totalMs = conflicts.reduce((sum, conflict) => {
      const detected = new Date(conflict.detectedAt).getTime();
      const resolved = new Date(conflict.resolvedAt).getTime();
      return sum + (resolved - detected);
    }, 0);

    return totalMs / conflicts.length / 1000; // Return in seconds
  }
}
