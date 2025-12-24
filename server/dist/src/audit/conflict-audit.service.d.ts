import { PrismaService } from '../prisma/prisma.service';
export declare class ConflictAuditService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logConflictDetection(userId: number, userRole: string, entityType: string, entityId: number, expectedVersion: number, currentVersion: number, conflictFields: string[], yourData: any, serverData: any, ipAddress?: string): Promise<number>;
    logConflictResolution(conflictLogId: number, resolvedData: any): Promise<void>;
    getConflictHistory(entityType: string, entityId: number): Promise<any[]>;
    getConflictStats(startDate: Date, endDate: Date): Promise<any>;
    private groupBy;
    private calculateAvgResolutionTime;
}
