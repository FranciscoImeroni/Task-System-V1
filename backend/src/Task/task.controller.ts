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
import { Query } from '@nestjs/common';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post() 
  async create(@Body() task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'displayId'>): Promise<Task> {
    return await this.taskService.create(task);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = Math.min(parseInt(limit, 10), 100); // max 100 per page
    return await this.taskService.findAllPaginated(pageNumber, limitNumber);
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