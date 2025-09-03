import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity'; 

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return await this.taskService.create(task);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return await this.taskService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() update: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    return await this.taskService.update(id, update);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.taskService.delete(id);
  }

  @Get(':id/estimates')
  async getSubtaskEstimates(@Param('id') id: string) {

    return await this.taskService.getSubtaskEstimates(id);
  }
}