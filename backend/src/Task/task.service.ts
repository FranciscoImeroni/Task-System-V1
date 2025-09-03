import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, Subtask, TaskStatus, TaskPriority } from './task.entity'; 
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) 
    private taskRepository: Repository<Task>,
  ) {}

  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'displayId'>): Promise<Task> {
    const now = new Date().toISOString();
    const newTask = this.taskRepository.create({ 
      ...taskData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      subtasks: taskData.subtasks || [],
    });
    return this.taskRepository.save(newTask); 
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.taskRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateData: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = {
      ...task,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return this.taskRepository.save(updatedTask);
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  sumEstimates(tasks: Subtask[], statuses?: Subtask['status'][]): number {
    return tasks.reduce((sum, t) => {
      const subSum = t.subtasks ? this.sumEstimates(t.subtasks, statuses) : 0;
      if (statuses && !statuses.includes(t.status)) return sum + subSum;
      return sum + (t.estimate || 0) + subSum;
    }, 0);
  }

  async getSubtaskEstimates(taskId: string): Promise<{ pending: number; started: number; total: number }> {
    const task = await this.findOne(taskId);
    if (!task || !task.subtasks) {
      return { pending: 0, started: 0, total: 0 };
    }

    const pendingStatuses: Subtask['status'][] = ["Backlog", "Unstarted"];
    const startedStatuses: Subtask['status'][] = ["Started"];

    const pending = this.sumEstimates(task.subtasks, pendingStatuses);
    const started = this.sumEstimates(task.subtasks, startedStatuses);
    const total = this.sumEstimates(task.subtasks); 

    return { pending, started, total };
  }
}