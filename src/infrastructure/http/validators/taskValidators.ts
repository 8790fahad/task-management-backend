import { Elysia } from 'elysia';
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  status: z.enum(['pending', 'completed']).optional(),
});

export const taskValidators = new Elysia()
  .guard({
    body: createTaskSchema,
  })
  .guard({
    body: updateTaskSchema,
  });


