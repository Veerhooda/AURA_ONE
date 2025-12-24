import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CareService } from './care.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { IsString, IsEnum, IsDateString, IsOptional, IsInt } from 'class-validator';

// --- DTOs ---
export class CreateTaskDto {
  @IsInt()
  patientId: number;

  @IsString()
  title: string;

  @IsOptional() @IsString()
  description?: string;



  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsDateString()
  dueAt: string;
}

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional() @IsString()
  notes?: string;
}

@ApiTags('care')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('care')
export class CareController {
  constructor(private careService: CareService) {}

  @Get('ward')
  @ApiOperation({ summary: 'Get prioritized tasks for a specific ward' })
  async getTasksByWard(@Query('ward') ward: string) {
    // Default to 'General' if no ward provided for now
    return this.careService.getTasksForWard(ward || 'General');
  }

  @Get('task')
  @ApiOperation({ summary: 'Get all care tasks (alias for ward tasks for now)' })
  async getTasks(@Query('ward') ward: string) {
    return this.careService.getTasksForWard(ward || 'General');
  }

  @Post('task')
  @ApiOperation({ summary: 'Create a new manual care task' })
  async createTask(@Request() req, @Body() body: CreateTaskDto) {
    return this.careService.createManualTask(req.user.userId, body);
  }

  @Patch('task/:id')
  @ApiOperation({ summary: 'Update task status (Complete/Skip)' })
  async updateTask(@Param('id') id: string, @Body() body: UpdateTaskStatusDto) {
    return this.careService.updateTaskStatus(parseInt(id), body.status, body.notes);
  }
}
