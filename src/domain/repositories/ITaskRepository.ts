import { Task } from '../entities/Task';
import { TaskStatus } from '../value-objects/TaskStatus';

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(status?: TaskStatus): Promise<Task[]>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
}


