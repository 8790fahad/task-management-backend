import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { NotFoundError } from '@application/errors/NotFoundError';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }

    await this.taskRepository.delete(id);
  }
}


