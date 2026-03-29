import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
export declare class CareService {
    private prisma;
    constructor(prisma: PrismaService);
    createManualTask(userId: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TaskStatus;
        patientId: number;
        title: string;
        description: string | null;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueTime: Date | null;
        completedAt: Date | null;
        completedBy: string | null;
        notes: string | null;
    }>;
    getTasksForWard(ward: string): Promise<any[]>;
    updateTaskStatus(taskId: number, status: TaskStatus, notes?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TaskStatus;
        patientId: number;
        title: string;
        description: string | null;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueTime: Date | null;
        completedAt: Date | null;
        completedBy: string | null;
        notes: string | null;
    }>;
    private _sortTasksByPriority;
    private _calculateScore;
}
