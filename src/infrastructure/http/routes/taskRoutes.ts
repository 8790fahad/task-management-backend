import { Elysia } from 'elysia';
import { CreateTaskUseCase } from '@application/use-cases/CreateTaskUseCase';
import { GetTaskByIdUseCase } from '@application/use-cases/GetTaskByIdUseCase';
import { GetAllTasksUseCase } from '@application/use-cases/GetAllTasksUseCase';
import { UpdateTaskUseCase } from '@application/use-cases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '@application/use-cases/DeleteTaskUseCase';
import { NotificationService } from '@application/services/NotificationService';
import { createTaskSchema, updateTaskSchema } from '../validators/taskValidators';
import { ValidationError } from '@application/errors/ValidationError';

export function createTaskRoutes(
  createTaskUseCase: CreateTaskUseCase,
  getTaskByIdUseCase: GetTaskByIdUseCase,
  getAllTasksUseCase: GetAllTasksUseCase,
  updateTaskUseCase: UpdateTaskUseCase,
  deleteTaskUseCase: DeleteTaskUseCase,
  notificationService: NotificationService
) {
  return new Elysia({ prefix: '/tasks' })
    .post(
      '/',
      async ({ body, set }) => {
        try {
          const parsed = createTaskSchema.parse(body);
          const dueDate = parsed.dueDate ? new Date(parsed.dueDate) : null;

          const task = await createTaskUseCase.execute(
            parsed.title,
            parsed.description || null,
            dueDate
          );

          await notificationService.checkAndNotify(task);

          set.status = 201;
          return task.toJSON();
        } catch (error: any) {
          if (error.name === 'ZodError') {
            throw new ValidationError(error.errors[0].message);
          }
          throw error;
        }
      },
      {
        body: createTaskSchema,
        detail: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          description: 'Creates a new task with the provided details. If the due date is within 24 hours, a notification will be queued.',
          responses: {
            201: {
              description: 'Task created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      title: { type: 'string' },
                      description: { type: 'string', nullable: true },
                      dueDate: { type: 'string', format: 'date-time', nullable: true },
                      status: { type: 'string', enum: ['pending', 'completed'] },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation error',
            },
          },
        },
      }
    )
    .get(
      '/',
      async ({ query }) => {
        const status = query.status as string | undefined;
        const tasks = await getAllTasksUseCase.execute(status);
        return tasks.map((task) => task.toJSON());
      },
      {
        detail: {
          tags: ['Tasks'],
          summary: 'Get all tasks',
          description: 'Retrieves all tasks. Optionally filter by status (pending or completed).',
          querystring: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['pending', 'completed'],
                description: 'Filter tasks by status',
              },
            },
          },
          responses: {
            200: {
              description: 'List of tasks',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        title: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        dueDate: { type: 'string', format: 'date-time', nullable: true },
                        status: { type: 'string', enum: ['pending', 'completed'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }
    )
    .get(
      '/:id',
      async ({ params }) => {
        const task = await getTaskByIdUseCase.execute(params.id);
        return task.toJSON();
      },
      {
        detail: {
          tags: ['Tasks'],
          summary: 'Get task by ID',
          description: 'Retrieves a specific task by its unique identifier.',
          params: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Task unique identifier',
              },
            },
            required: ['id'],
          },
          responses: {
            200: {
              description: 'Task found',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      title: { type: 'string' },
                      description: { type: 'string', nullable: true },
                      dueDate: { type: 'string', format: 'date-time', nullable: true },
                      status: { type: 'string', enum: ['pending', 'completed'] },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Task not found',
            },
          },
        },
      }
    )
    .put(
      '/:id',
      async ({ params, body }) => {
        try {
          const parsed = updateTaskSchema.parse(body);
          const dueDate = parsed.dueDate !== undefined
            ? (parsed.dueDate ? new Date(parsed.dueDate) : null)
            : undefined;

          const task = await updateTaskUseCase.execute(
            params.id,
            parsed.title,
            parsed.description,
            dueDate,
            parsed.status
          );

          await notificationService.checkAndNotify(task);

          return task.toJSON();
        } catch (error: any) {
          if (error.name === 'ZodError') {
            throw new ValidationError(error.errors[0].message);
          }
          throw error;
        }
      },
      {
        body: updateTaskSchema,
        detail: {
          tags: ['Tasks'],
          summary: 'Update a task',
          description: 'Updates an existing task. All fields are optional. If the due date is updated and is within 24 hours, a notification will be queued.',
          params: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Task unique identifier',
              },
            },
            required: ['id'],
          },
          responses: {
            200: {
              description: 'Task updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      title: { type: 'string' },
                      description: { type: 'string', nullable: true },
                      dueDate: { type: 'string', format: 'date-time', nullable: true },
                      status: { type: 'string', enum: ['pending', 'completed'] },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation error',
            },
            404: {
              description: 'Task not found',
            },
          },
        },
      }
    )
    .delete(
      '/:id',
      async ({ params, set }) => {
        await deleteTaskUseCase.execute(params.id);
        set.status = 204;
        return;
      },
      {
        detail: {
          tags: ['Tasks'],
          summary: 'Delete a task',
          description: 'Deletes a task by its unique identifier.',
          params: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Task unique identifier',
              },
            },
            required: ['id'],
          },
          responses: {
            204: {
              description: 'Task deleted successfully',
            },
            404: {
              description: 'Task not found',
            },
          },
        },
      }
    );
}


