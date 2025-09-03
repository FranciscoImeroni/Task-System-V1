import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      subtasks: task.subtasks || [],
    };
    this.tasks.push(newTask);
    return newTask;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  update(id: string, update: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new NotFoundException('Task not found');
    const oldTask = this.tasks[idx];
    const updatedTask = {
      ...oldTask,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    this.tasks[idx] = updatedTask;
    return updatedTask;
  }

  delete(id: string): void {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new NotFoundException('Task not found');
    this.tasks.splice(idx, 1);
  }

  // Estimate calculations
  sumEstimates(tasks: Task[], statuses?: TaskStatus[]): number {
    return tasks.reduce((sum, t) => {
      const subSum = t.subtasks ? this.sumEstimates(t.subtasks, statuses) : 0;
      if (statuses && !statuses.includes(t.status)) return sum + subSum;
      return sum + (t.estimate || 0) + subSum;
    }, 0);
  }
}