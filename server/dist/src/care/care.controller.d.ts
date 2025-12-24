import { CareService } from './care.service';
import { TaskStatus, TaskPriority } from '@prisma/client';
export declare class CreateTaskDto {
    patientId: number;
    title: string;
    description?: string;
    priority: TaskPriority;
    dueAt: string;
}
export declare class UpdateTaskStatusDto {
    status: TaskStatus;
    notes?: string;
}
export declare class CareController {
    private careService;
    constructor(careService: CareService);
    getTasksByWard(ward: string): Promise<any[]>;
    getTasks(ward: string): Promise<any[]>;
    createTask(req: any, body: CreateTaskDto): Promise<{
        id: number;
        patientId: number;
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
    }>;
    updateTask(id: string, body: UpdateTaskStatusDto): Promise<{
        id: number;
        patientId: number;
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
    }>;
}
