import { eq } from 'drizzle-orm';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Task';
import { TaskStatus } from '@domain/value-objects/TaskStatus';
import { db } from '../db';
import { tasks, TaskRow } from '../schema';

export class TaskRepository implements ITaskRepository {
  async create(task: Task): Promise<Task> {
    const [inserted] = await db
      .insert(tasks)
      .values({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate?.value || null,
        status: task.status.value,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })
      .returning();

    return Task.fromPersistence(
      inserted.id,
      inserted.title,
      inserted.description,
      inserted.dueDate,
      inserted.status,
      inserted.createdAt,
      inserted.updatedAt
    );
  }

  async findById(id: string): Promise<Task | null> {
    const [result] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);

    if (!result) {
      return null;
    }

    return Task.fromPersistence(
      result.id,
      result.title,
      result.description,
      result.dueDate,
      result.status,
      result.createdAt,
      result.updatedAt
    );
  }

  async findAll(status?: TaskStatus): Promise<Task[]> {
    const results = status
      ? await db.select().from(tasks).where(eq(tasks.status, status.value))
      : await db.select().from(tasks);

    return results.map((row: TaskRow) =>
      Task.fromPersistence(
        row.id,
        row.title,
        row.description,
        row.dueDate,
        row.status,
        row.createdAt,
        row.updatedAt
      )
    );
  }

  async update(task: Task): Promise<Task> {
    const [updated] = await db
      .update(tasks)
      .set({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate?.value || null,
        status: task.status.value,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, task.id))
      .returning();

    return Task.fromPersistence(
      updated.id,
      updated.title,
      updated.description,
      updated.dueDate,
      updated.status,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
}

