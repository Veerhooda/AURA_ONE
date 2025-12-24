import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(userId: number, userRole: string, action: string, entityType: string, entityId: number | null, changes: any, ipAddress?: string): Promise<void>;
    getEntityAuditTrail(entityType: string, entityId: number): Promise<({
        user: {
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: number;
        userId: number;
        userRole: string;
        action: string;
        entityType: string;
        entityId: number | null;
        changes: import("@prisma/client/runtime/library").JsonValue;
        ipAddress: string | null;
        timestamp: Date;
    })[]>;
    getUserAuditTrail(userId: number, limit?: number): Promise<{
        id: number;
        userId: number;
        userRole: string;
        action: string;
        entityType: string;
        entityId: number | null;
        changes: import("@prisma/client/runtime/library").JsonValue;
        ipAddress: string | null;
        timestamp: Date;
    }[]>;
    getActionAuditTrail(action: string, limit?: number): Promise<({
        user: {
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: number;
        userId: number;
        userRole: string;
        action: string;
        entityType: string;
        entityId: number | null;
        changes: import("@prisma/client/runtime/library").JsonValue;
        ipAddress: string | null;
        timestamp: Date;
    })[]>;
}
