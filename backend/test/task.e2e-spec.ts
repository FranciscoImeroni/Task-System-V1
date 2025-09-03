import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { Task } from './../src/Task/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let taskRepository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get the TaskRepository to clear the database before each test
    taskRepository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
  });

  beforeEach(async () => {
    // Clear the tasks table and reset the displayId sequence before each test
    // This ensures tests are isolated and displayId starts from 1 for each test suite
    await taskRepository.query('TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks (POST) - should create a task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test description.',
      priority: 'Medium',
      status: 'Backlog',
      estimate: 5,
      subtasks: [],
    };

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String), // UUID
        displayId: 1, // First task created should have displayId 1
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        estimate: newTask.estimate,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        subtasks: newTask.subtasks,
      }),
    );
  });

  it('/tasks (GET) - should return an array of tasks', async () => {
    // Create a task first
    await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Task 1',
        description: 'Desc 1',
        priority: 'Low',
        status: 'Backlog',
        estimate: 1,
        subtasks: [],
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        displayId: 1,
        title: 'Task 1',
      }),
    );
  });

  it('/tasks/:id (GET) - should return a single task by ID', async () => {
    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Task to find',
        description: 'Desc to find',
        priority: 'High',
        status: 'In Progress',
        estimate: 3,
        subtasks: [],
      })
      .expect(201);

    const taskId = createdTask.body.id;

    const response = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: taskId,
        displayId: 1,
        title: 'Task to find',
      }),
    );
  });

  it('/tasks/:id (GET) - should return 404 if task not found', () => {
    return request(app.getHttpServer())
      .get('/tasks/non-existent-id')
      .expect(404);
  });

  it('/tasks/:id (PUT) - should update a task', async () => {
    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Task to update',
        description: 'Original desc',
        priority: 'Low',
        status: 'Backlog',
        estimate: 2,
        subtasks: [],
      })
      .expect(201);

    const taskId = createdTask.body.id;
    const updatedTitle = 'Updated Task Title';
    const updatedStatus = 'Completed';

    const response = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send({ title: updatedTitle, status: updatedStatus })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: taskId,
        displayId: 1,
        title: updatedTitle,
        status: updatedStatus,
        updatedAt: expect.any(String), // updatedAt should be updated
      }),
    );
    expect(response.body.updatedAt).not.toBe(createdTask.body.updatedAt);
  });

  it('/tasks/:id (PUT) - should return 404 if task to update not found', () => {
    return request(app.getHttpServer())
      .put('/tasks/non-existent-id')
      .send({ title: 'Non-existent' })
      .expect(404);
  });

  it('/tasks/:id (DELETE) - should delete a task', async () => {
    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Task to delete',
        description: 'Desc to delete',
        priority: 'Medium',
        status: 'Backlog',
        estimate: 1,
        subtasks: [],
      })
      .expect(201);

    const taskId = createdTask.body.id;

    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .expect(204); // 204 No Content for successful deletion

    // Verify it's deleted
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(404);
  });

  it('/tasks/:id (DELETE) - should return 404 if task to delete not found', () => {
    return request(app.getHttpServer())
      .delete('/tasks/non-existent-id')
      .expect(404);
  });

  // Test for estimates endpoint
  it('/tasks/:id/estimates (GET) - should return subtask estimates', async () => {
    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Task with subtasks',
        description: 'Desc',
        priority: 'Low',
        status: 'Backlog',
        estimate: 0,
        subtasks: [
          { title: 'Subtask 1', estimate: 2, status: 'Unstarted' },
          { title: 'Subtask 2', estimate: 3, status: 'Started' },
          { title: 'Subtask 3', estimate: 1, status: 'Completed' },
        ],
      })
      .expect(201);

    const taskId = createdTask.body.id;

    const response = await request(app.getHttpServer())
      .get(`/tasks/${taskId}/estimates`)
      .expect(200);

    expect(response.body).toEqual({
      pending: 2, // Unstarted
      started: 3, // Started
      total: 6,   // 2 + 3 + 1
    });
  });

  it('/tasks/:id/estimates (GET) - should return 0 for estimates if no subtasks', async () => {
    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Task without subtasks',
        description: 'Desc',
        priority: 'Low',
        status: 'Backlog',
        estimate: 0,
        subtasks: [],
      })
      .expect(201);

    const taskId = createdTask.body.id;

    const response = await request(app.getHttpServer())
      .get(`/tasks/${taskId}/estimates`)
      .expect(200);

    expect(response.body).toEqual({
      pending: 0,
      started: 0,
      total: 0,
    });
  });

  it('/tasks/:id/estimates (GET) - should return 404 if task not found for estimates', () => {
    return request(app.getHttpServer())
      .get('/tasks/non-existent-id/estimates')
      .expect(404);
  });
});