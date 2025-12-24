import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
export declare class CareService {
    private prisma;
    constructor(prisma: PrismaService);
    createManualTask(userId: number, data: any): Promise<{
        title: string;
        description: string | null;
        priority: import(".prisma/client").$Enums.TaskPriority;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueTime: Date | null;
        completedAt: Date | null;
        completedBy: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        patientId: number;
    }>;
    getTasksForWard(ward: string): Promise<any[]>;
    updateTaskStatus(taskId: number, status: TaskStatus, notes?: string): Promise<{
        title: string;
        description: string | null;
        priority: import(".prisma/client").$Enums.TaskPriority;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueTime: Date | null;
        completedAt: Date | null;
        completedBy: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        patientId: number;
    }>;
    private _sortTasksByPriority;
    private _calculateScore;
}
