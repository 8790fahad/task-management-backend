import { Task } from '@domain/entities/Task';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { TaskStatus } from '@domain/value-objects/TaskStatus';
import { NotFoundError } from '@application/errors/NotFoundError';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    id: string,
    title?: string,
    description?: string | null,
    dueDate?: Date | null,
    status?: string
  ): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id);

    if (!existingTask) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }

    const taskStatus = status ? TaskStatus.fromString(status) : undefined;

    const updatedTask = existingTask.update(
      title,
      description,
      dueDate,
      taskStatus
    );

    return await this.taskRepository.update(updatedTask);
  }
}


