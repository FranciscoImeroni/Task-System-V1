import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, Subtask, TaskStatus, TaskPriority } from './task.entity'; // Asegúrate de importar la clase Task
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm'; // Importa InjectRepository
import { Repository } from 'typeorm'; // Importa Repository

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) // Inyecta el repositorio de la entidad Task
    private taskRepository: Repository<Task>,
  ) {}

  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    const newTask = this.taskRepository.create({ // Usa .create de TypeORM para crear una nueva instancia
      ...taskData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      subtasks: taskData.subtasks || [],
    });
    return this.taskRepository.save(newTask); // Guarda la nueva tarea en la base de datos
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find(); // Encuentra todas las tareas en la base de datos
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } }); // Busca una tarea por ID
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

    return this.taskRepository.save(updatedTask); // Guarda los cambios en la base de datos
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id); // Elimina una tarea por ID
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  // Las funciones de cálculo de estimaciones pueden permanecer igual,
  // ya que operan sobre los datos de la tarea una vez obtenidos.
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
    const total = this.sumEstimates(task.subtasks); // Suma total sin filtrar por estado

    return { pending, started, total };
  }
}