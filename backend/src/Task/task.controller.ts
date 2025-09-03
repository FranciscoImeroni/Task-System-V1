import { Controller, Get, Post, Body, Param, Put, Delete} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskStatus, TaskPriority } from './task.entity';

@Controller('tasks') 
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    return this.taskService.create(task);
  }

  @Get()
  findAll(): Task[] {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Task {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() update: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
    return this.taskService.update(id, update);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { message: string } {
    this.taskService.delete(id);
    return { message: 'Task deleted' };
  }

  @Get(':id/estimates')
  getEstimates(@Param('id') id: string): { pending: number; started: number; total: number } {
    const task = this.taskService.findOne(id);
    const pending = task.subtasks ? this.taskService.sumEstimates(task.subtasks, ['Backlog', 'Unstarted']) : 0;
    const started = task.subtasks ? this.taskService.sumEstimates(task.subtasks, ['Started']) : 0;
    const total = task.subtasks ? this.taskService.sumEstimates(task.subtasks) : 0;
    return { pending, started, total };
  }
}