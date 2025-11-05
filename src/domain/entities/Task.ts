import { TaskStatus } from '../value-objects/TaskStatus';
import { DueDate } from '../value-objects/DueDate';

export class Task {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly dueDate: DueDate | null,
    public readonly status: TaskStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    id: string,
    title: string,
    description: string | null,
    dueDate: Date | null,
    status: TaskStatus,
    createdAt: Date,
    updatedAt: Date
  ): Task {
    return new Task(
      id,
      title,
      description,
      dueDate ? DueDate.create(dueDate) : null,
      status,
      createdAt,
      updatedAt
    );
  }

  static fromPersistence(
    id: string,
    title: string,
    description: string | null,
    dueDate: Date | null,
    status: string,
    createdAt: Date,
    updatedAt: Date
  ): Task {
    return new Task(
      id,
      title,
      description,
      dueDate ? DueDate.create(dueDate) : null,
      TaskStatus.fromString(status),
      createdAt,
      updatedAt
    );
  }

  update(
    title?: string,
    description?: string | null,
    dueDate?: Date | null,
    status?: TaskStatus
  ): Task {
    return new Task(
      this.id,
      title ?? this.title,
      description !== undefined ? description : this.description,
      dueDate !== undefined ? (dueDate ? DueDate.create(dueDate) : null) : this.dueDate,
      status ?? this.status,
      this.createdAt,
      new Date()
    );
  }

  isDueWithin24Hours(): boolean {
    if (!this.dueDate) {
      return false;
    }
    return this.dueDate.isWithin24Hours();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate?.value.toISOString() || null,
      status: this.status.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}


