import { Task } from '@domain/entities/Task';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { TaskStatus } from '@domain/value-objects/TaskStatus';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    title: string,
    description: string | null,
    dueDate: Date | null
  ): Promise<Task> {
    const task = Task.create(
      crypto.randomUUID(),
      title,
      description,
      dueDate,
      TaskStatus.pending(),
      new Date(),
      new Date()
    );

    return await this.taskRepository.create(task);
  }
}


