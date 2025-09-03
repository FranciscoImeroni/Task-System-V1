import { TaskService } from './task.service';
import { Task } from './task.entity';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
  });

  it('should create a task', () => {
    const task = service.create({
      title: 'Test',
      description: 'Desc',
      status: 'Backlog',
      subtasks: [],
    });
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test');
    expect(task.status).toBe('Backlog');
    expect(service.findAll().length).toBe(1);
  });

  it('should update a task', () => {
    const task = service.create({
      title: 'Test',
      description: 'Desc',
      status: 'Backlog',
      subtasks: [],
    });
    const updated = service.update(task.id, { title: 'Updated' });
    expect(updated.title).toBe('Updated');
    expect(updated.updatedAt).not.toBe(task.updatedAt);
  });

  it('should delete a task', () => {
    const task = service.create({
      title: 'Test',
      description: 'Desc',
      status: 'Backlog',
      subtasks: [],
    });
    service.delete(task.id);
    expect(service.findAll().length).toBe(0);
  });

  it('should calculate estimates for nested subtasks', () => {
    const subtasks: Task[] = [
      { id: '1', title: 'A', description: '', status: 'Backlog', createdAt: '', updatedAt: '', estimate: 2, subtasks: [] },
      { id: '2', title: 'B', description: '', status: 'Started', createdAt: '', updatedAt: '', estimate: 3, subtasks: [
        { id: '3', title: 'B1', description: '', status: 'Backlog', createdAt: '', updatedAt: '', estimate: 1, subtasks: [] }
      ] },
    ];
    const pending = service.sumEstimates(subtasks, ['Backlog', 'Unstarted']);
    const started = service.sumEstimates(subtasks, ['Started']);
    const total = service.sumEstimates(subtasks);
    expect(pending).toBe(3); // 2 (A) + 1 (B1)
    expect(started).toBe(3); // 3 (B)
    expect(total).toBe(6); // 2 (A) + 3 (B) + 1 (B1)
  });
});