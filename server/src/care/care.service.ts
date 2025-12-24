import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskPriority, TaskStatus, CareTask } from '@prisma/client';

@Injectable()
export class CareService {
  constructor(private prisma: PrismaService) {}

  async createManualTask(userId: number, data: any) {
    return this.prisma.careTask.create({
      data: {
        ...data,
        creatorId: userId,
        status: TaskStatus.PENDING,
      }
    });
  }

  async getTasksForWard(ward: string) {
    // 1. Fetch all pending/in-progress tasks for the ward
    const tasks = await this.prisma.careTask.findMany({
      where: {
        patient: { ward: ward },
        status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] }
      },
      include: {
        patient: {
          select: { id: true, user: { select: { name: true } }, bed: true, riskScore: true, latestVitals: true }
        }
      }
    });

    // 2. Intelligent Sorting Logic
    return this._sortTasksByPriority(tasks);
  }

  async updateTaskStatus(taskId: number, status: TaskStatus, notes?: string) {
    return this.prisma.careTask.update({
      where: { id: taskId },
      data: {
        status,
        notes,
        completedAt: status === TaskStatus.COMPLETED ? new Date() : null
      }
    });
  }

  private _sortTasksByPriority(tasks: any[]) {
    const now = new Date().getTime();

    return tasks.sort((a, b) => {
      const scoreA = this._calculateScore(a, now);
      const scoreB = this._calculateScore(b, now);
      return scoreB - scoreA; // Descending
    });
  }

  private _calculateScore(task: any, now: number): number {
    let score = 0;

    // 1. Base Priority
    switch (task.priority) {
      case TaskPriority.CRITICAL: score += 1000; break;
      case TaskPriority.HIGH: score += 500; break;
      case TaskPriority.ROUTINE: score += 100; break;
      case TaskPriority.LOW: score += 0; break;
    }

    // 2. Time Urgency
    const dueTime = new Date(task.dueAt).getTime();
    const diffMinutes = (now - dueTime) / 60000;

    if (diffMinutes > 0) {
      // Overdue: Add 10 points per minute overdue (cap at 400)
      score += Math.min(diffMinutes * 10, 400);
    } else if (diffMinutes > -30) {
      // Due soon (within 30 mins): Add 50
      score += 50;
    }

    // 3. Patient Severity (Risk Score 0-100)
    if (task.patient.riskScore) {
      score += task.patient.riskScore;
    }

    return score;
  }
}
