import { Task } from '@domain/entities/Task';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { TaskStatus } from '@domain/value-objects/TaskStatus';

export class GetAllTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(status?: string): Promise<Task[]> {
    const taskStatus = status ? TaskStatus.fromString(status) : undefined;
    return await this.taskRepository.findAll(taskStatus);
  }
}


