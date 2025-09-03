import { TaskService } from './task.service';
import { Task, Subtask, TaskPriority, TaskStatus } from './task.entity'; 
import { Repository } from 'typeorm';

describe('TaskService', () => {
  let service: TaskService;
  let mockRepository: Partial<Repository<Task>>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn().mockImplementation((task) => ({ ...task, id: 'uuid', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), displayId: 1 })),
      save: jest.fn().mockImplementation((task) => Promise.resolve(task)),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    service = new TaskService(mockRepository as Repository<Task>);
  });

  it('should create a task', async () => {
    const taskData = {
      title: 'Test',
      description: 'Desc',
      priority: 'Medium' as TaskPriority,
      status: 'Backlog' as TaskStatus, 
      subtasks: [],
      estimate: 5,
    };
    const task = await service.create(taskData);
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test');
    expect(task.status).toBe('Backlog');
  });

  it('should update a task', async () => {
    const existingTask = {
      id: 'uuid',
      title: 'Test',
      description: 'Desc',
      priority: 'Medium' as TaskPriority, 
      status: 'Backlog' as TaskStatus, 
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      displayId: 1,
      estimate: 5,
    };
    mockRepository.findOne = jest.fn().mockResolvedValue(existingTask);
    mockRepository.save = jest.fn().mockImplementation((task) => Promise.resolve(task));

    const updated = await service.update(existingTask.id, { title: 'Updated' });
    expect(updated.title).toBe('Updated');
    expect(updated.updatedAt).not.toBe(existingTask.updatedAt);
  });

  it('should delete a task', async () => {
    mockRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });
    await service.delete('uuid');
    expect(mockRepository.delete).toHaveBeenCalledWith('uuid');
  });

  it('should calculate estimates for nested subtasks', () => {
    const subtasks: Subtask[] = [
      { title: 'A', estimate: 2, status: 'Backlog' },
      { title: 'B', estimate: 3, status: 'Started', subtasks: [
        { title: 'B1', estimate: 1, status: 'Backlog' }
      ] },
    ];
    const pending = service.sumEstimates(subtasks, ['Backlog', 'Unstarted']);
    const started = service.sumEstimates(subtasks, ['Started']);
    const total = service.sumEstimates(subtasks);
    expect(pending).toBe(3);
    expect(started).toBe(3);
    expect(total).toBe(6);
  });
});